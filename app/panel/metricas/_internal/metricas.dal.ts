import "server-only";

import type { RowDataPacket } from "mysql2/promise";

import { getPool } from "@/app/_internal/db";
import { getCurrentUser } from "@/app/_internal/session";
import type { Clasificacion } from "@/app/_interfaces/analisis";
import type {
  EstadoAtencion,
  FiltrosMetricasDTO,
  MetricasClasificacionDTO,
  MetricasDTO,
  MetricasSerieDTO,
} from "@/app/_interfaces/metricas";
import { toClasificacion } from "../../_internal/analisis.mapper";
import {
  ClasificacionRowSchema,
  PrevioRowSchema,
  ReportanteRowSchema,
  ResumenRowSchema,
  SerieRowSchema,
} from "../_schemas/metricas-rows.schema";
import { construirVentana } from "./periodo";

const TOP_REPORTANTES = 5;

/**
 * One row per analysis in a time window, with its attention flags. Dates go
 * through FROM_UNIXTIME/UNIX_TIMESTAMP, which use the same session zone the
 * DATETIME columns were written in.
 */
const BASE = `
  SELECT
    c.id,
    c.solicitante_email,
    c.riesgo,
    c.fecha_analisis,
    REPLACE(UPPER(TRIM(c.clasificacion)), ' ', '_') AS clasif,
    EXISTS (SELECT 1 FROM eventos_sistema e WHERE e.correo_id = c.id AND e.tipo = 'AMENAZA_CRITICA') AS critico,
    EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id) AS atendido,
    EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id AND a.tipo = 'ANULADO') AS anulado,
    EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id AND a.tipo = 'BUSQUEDA_TENANT') AS busqueda_tenant,
    EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id AND a.tipo = 'DOMINIO_BLOQUEADO') AS bloqueado,
    EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id AND a.tipo = 'INFORME_REENVIADO') AS reenviado
  FROM correos_analizados c
  WHERE c.fecha_analisis >= FROM_UNIXTIME(?) AND c.fecha_analisis <= FROM_UNIXTIME(?)
`;

/** Whitelisted SQL per attention state; never built from user text. */
const CONDICION_ESTADO: Record<EstadoAtencion, string> = {
  todos: "TRUE",
  pendientes: "NOT b.atendido",
  atendidos: "b.atendido",
  anulados: "b.anulado",
  busqueda_tenant: "b.busqueda_tenant",
  bloqueados: "b.bloqueado",
  reenviados: "b.reenviado",
};

function condicionClasificacion(filtros: FiltrosMetricasDTO) {
  return filtros.clasificacion === "todas"
    ? { sql: "TRUE", params: [] as string[] }
    : { sql: "b.clasif = ?", params: [filtros.clasificacion] };
}

/**
 * Metrics for the analyst's sheet, or null for anyone else. Every figure
 * honours the three filters, except the two breakdowns that compare a
 * dimension against itself: attention ignores the state filter and the
 * classification breakdown ignores the classification filter.
 */
export async function getMetricas(
  filtros: FiltrosMetricasDTO,
  ahora: Date,
): Promise<MetricasDTO | null> {
  const user = await getCurrentUser();

  if (user.role !== "ANALISTA") {
    return null;
  }

  const pool = getPool();
  const ventana = construirVentana(filtros.periodo, ahora);
  const rango = [ventana.desde, ventana.hasta];
  const estado = `(${CONDICION_ESTADO[filtros.estado]})`;
  const clasif = condicionClasificacion(filtros);

  const [[resumenRows], [previoRows], [clasifRows], [serieRows], [reportanteRows]] =
    await Promise.all([
      pool.execute<RowDataPacket[]>(
        `SELECT
           SUM(${estado}) AS analizados,
           SUM(${estado} AND b.clasif = 'PHISHING') AS phishing,
           SUM(${estado} AND b.critico) AS criticos,
           COUNT(DISTINCT CASE WHEN ${estado} THEN b.solicitante_email END) AS reportantes,
           AVG(CASE WHEN ${estado} THEN b.riesgo END) AS riesgo_promedio,
           COUNT(*) AS total,
           SUM(NOT b.atendido) AS pendientes,
           SUM(b.atendido) AS atendidos,
           SUM(b.anulado) AS anulados,
           SUM(b.busqueda_tenant) AS busqueda_tenant,
           SUM(b.bloqueado) AS bloqueados,
           SUM(b.reenviado) AS reenviados
         FROM (${BASE}) b
         WHERE ${clasif.sql}`,
        [...rango, ...clasif.params],
      ),
      pool.execute<RowDataPacket[]>(
        `SELECT COUNT(*) AS analizados, SUM(b.clasif = 'PHISHING') AS phishing
         FROM (${BASE}) b
         WHERE ${clasif.sql} AND ${estado}`,
        // The previous window ends one second before this one starts.
        [ventana.previoDesde, ventana.desde - 1, ...clasif.params],
      ),
      pool.execute<RowDataPacket[]>(
        `SELECT b.clasif AS clasificacion, COUNT(*) AS total
         FROM (${BASE}) b
         WHERE ${estado}
         GROUP BY b.clasif`,
        rango,
      ),
      pool.execute<RowDataPacket[]>(
        `SELECT FLOOR(UNIX_TIMESTAMP(b.fecha_analisis) / 3600) AS hora,
                COUNT(*) AS total,
                SUM(b.clasif = 'PHISHING') AS phishing
         FROM (${BASE}) b
         WHERE ${clasif.sql} AND ${estado}
         GROUP BY hora`,
        [...rango, ...clasif.params],
      ),
      pool.execute<RowDataPacket[]>(
        `SELECT b.solicitante_email AS email,
                COUNT(*) AS total,
                SUM(b.clasif = 'PHISHING') AS phishing
         FROM (${BASE}) b
         WHERE ${clasif.sql} AND ${estado}
         GROUP BY b.solicitante_email
         ORDER BY total DESC, email
         LIMIT ${TOP_REPORTANTES}`,
        [...rango, ...clasif.params],
      ),
    ]);

  const resumen = ResumenRowSchema.parse(resumenRows[0] ?? {});
  const previo = PrevioRowSchema.parse(previoRows[0] ?? {});

  return {
    filtros,
    desde: new Date(ventana.desde * 1000).toISOString(),
    hasta: new Date(ventana.hasta * 1000).toISOString(),
    resumen: {
      analizados: resumen.analizados,
      phishing: resumen.phishing,
      criticos: resumen.criticos,
      reportantes: resumen.reportantes,
      riesgoPromedio:
        resumen.riesgo_promedio === null ? null : Math.round(resumen.riesgo_promedio),
      analizadosPrevio: previo.analizados,
      phishingPrevio: previo.phishing,
    },
    atencion: {
      total: resumen.total,
      pendientes: resumen.pendientes,
      atendidos: resumen.atendidos,
      anulados: resumen.anulados,
      busqueda_tenant: resumen.busqueda_tenant,
      bloqueados: resumen.bloqueados,
      reenviados: resumen.reenviados,
    },
    porClasificacion: agruparClasificaciones(
      clasifRows.map((row) => ClasificacionRowSchema.parse(row)),
    ),
    serie: armarSerie(
      ventana,
      serieRows.map((row) => SerieRowSchema.parse(row)),
    ),
    reportantes: reportanteRows.map((row) => ReportanteRowSchema.parse(row)),
  };
}

/** Every known class in severity order, zeros included; unknown ones folded last. */
function agruparClasificaciones(
  filas: { clasificacion: string; total: number }[],
): MetricasClasificacionDTO[] {
  const totales = new Map<Clasificacion, number>();
  for (const fila of filas) {
    const clase = toClasificacion(fila.clasificacion);
    totales.set(clase, (totales.get(clase) ?? 0) + fila.total);
  }

  const orden: Clasificacion[] = [
    "PHISHING",
    "SOSPECHOSO",
    "NO_CONCLUYENTE",
    "PROBABLEMENTE_LEGITIMO",
  ];
  const resultado = orden.map((clasificacion) => ({ clasificacion, total: totales.get(clasificacion) ?? 0 }));

  const desconocidas = totales.get("DESCONOCIDA") ?? 0;
  if (desconocidas > 0) {
    resultado.push({ clasificacion: "DESCONOCIDA", total: desconocidas });
  }

  return resultado;
}

/** Folds the hourly counts into the window's buckets, empty ones included. */
function armarSerie(
  ventana: ReturnType<typeof construirVentana>,
  filas: { hora: number; total: number; phishing: number }[],
): MetricasSerieDTO[] {
  const porClave = new Map(
    ventana.buckets.map((bucket) => [bucket.clave, { total: 0, phishing: 0 }]),
  );

  for (const fila of filas) {
    const acumulado = porClave.get(ventana.claveDeHora(fila.hora));
    if (acumulado) {
      acumulado.total += fila.total;
      acumulado.phishing += fila.phishing;
    }
  }

  return ventana.buckets.map((bucket) => ({
    desde: bucket.inicio.toISOString(),
    etiqueta: bucket.etiqueta,
    etiquetaLarga: bucket.etiquetaLarga,
    total: porClave.get(bucket.clave)?.total ?? 0,
    phishing: porClave.get(bucket.clave)?.phishing ?? 0,
  }));
}
