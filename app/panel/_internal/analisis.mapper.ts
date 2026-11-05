import "server-only";

import type {
  AnalisisDetalleDTO,
  AnalisisStubDTO,
  Clasificacion,
  EstadoEnvio,
  IndicadorDTO,
  TimbreDTO,
} from "@/app/_interfaces/analisis";
import { CLASIFICACIONES, TIPOS_ACCION } from "@/app/_interfaces/analisis";
import type { TipoAccion } from "@/app/_interfaces/analisis";
import { CLASIFICACION_LABEL } from "@/app/_utils/analisis-labels";
import { tecnicaAttack } from "@/app/_utils/attack";
import type {
  AccionRow,
  DetalleRow,
  EventoRow,
  StubRow,
} from "../_schemas/analisis-rows.schema";

const toIso = (unixSeconds: number) =>
  new Date(unixSeconds * 1000).toISOString();

export function toClasificacion(raw: string): Clasificacion {
  const normalized = raw
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  return (CLASIFICACIONES as readonly string[]).includes(normalized)
    ? (normalized as Clasificacion)
    : "DESCONOCIDA";
}

function toEstadoEnvio(raw: string): EstadoEnvio {
  const normalized = raw.trim().toUpperCase();
  if (normalized === "ENVIADO") return "ENVIADO";
  if (normalized === "PENDIENTE") return "PENDIENTE";
  if (["ERROR", "FALLIDO", "FALLO"].includes(normalized)) return "FALLIDO";
  return "DESCONOCIDO";
}

/**
 * Analyzer text can carry raw enums and snake_case slugs. Known
 * classifications become their labels; other slugs become words.
 */
function legible(texto: string): string {
  let resultado = texto;
  for (const clave of CLASIFICACIONES) {
    resultado = resultado.replaceAll(clave, CLASIFICACION_LABEL[clave]);
  }
  return resultado.replace(/([a-záéíóúñ])_(?=[a-záéíóúñ])/gi, "$1 ").trim();
}

/** "Riesgo 95/100" repeats the figure the coupon already shows large. */
const RIESGO_REDUNDANTE = /^riesgo\s+\d{1,3}\s*\/\s*100$/i;

function detalleEvento(detalle: string | null): string | null {
  if (!detalle || RIESGO_REDUNDANTE.test(detalle.trim())) return null;
  return legible(detalle);
}

function toTipoAccion(raw: string | null): TipoAccion | null {
  return raw && (TIPOS_ACCION as readonly string[]).includes(raw)
    ? (raw as TipoAccion)
    : null;
}

export function toStubDTO(row: StubRow): AnalisisStubDTO {
  return {
    id: row.id,
    numero: row.id.padStart(6, "0"),
    asunto: row.asunto.trim() || "(sin asunto)",
    solicitante: row.solicitante_email,
    clasificacion: toClasificacion(row.clasificacion),
    riesgo: row.riesgo,
    estadoEnvio: toEstadoEnvio(row.estado_envio),
    analizadoEn: toIso(row.analizado_ts),
    critico: row.critico,
    atendido: row.atendido,
    anulado: row.anulado,
    ultimaAccion: toTipoAccion(row.ultima_accion),
    tecnica: tecnicaAttack(row.attack_tecnica),
  };
}

export function toDetalleDTO(
  row: DetalleRow,
  indicadores: IndicadorDTO[],
  eventos: EventoRow[],
  acciones: AccionRow[],
): AnalisisDetalleDTO {
  const timbres: TimbreDTO[] = [
    ...eventos.map(
      (evento): TimbreDTO => ({
        id: `e${evento.id}`,
        origen: "SISTEMA",
        tipo: evento.tipo,
        fecha: toIso(evento.fecha_ts),
        autor: null,
        detalle: detalleEvento(evento.detalle),
      }),
    ),
    ...acciones.map(
      (accion): TimbreDTO => ({
        id: `a${accion.id}`,
        origen: "ANALISTA",
        tipo: accion.tipo,
        fecha: toIso(accion.fecha_ts),
        autor: accion.autor,
        detalle: accion.detalle ? legible(accion.detalle) : null,
      }),
    ),
    // Each query already comes ordered by (fecha, id). The sort is stable, so
    // ties in the same second keep that order (system events before analyst
    // actions). Comparing the prefixed ids as text put "e10" before "e9".
  ].sort((a, b) => a.fecha.localeCompare(b.fecha));

  return {
    ...toStubDTO(row),
    resumen: row.resumen?.trim() || null,
    recomendacion: row.recomendacion?.trim() || null,
    evidenciaAttack: row.attack_evidencia?.trim() || null,
    enviadoEn: row.enviado_ts ? toIso(row.enviado_ts) : null,
    indicadores: indicadores.map((indicador) => ({
      ...indicador,
      descripcion: legible(indicador.descripcion),
    })),
    timbres,
  };
}
