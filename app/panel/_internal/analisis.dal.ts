import "server-only";

import type { RowDataPacket } from "mysql2/promise";

import { getPool } from "@/app/_internal/db";
import { getCurrentUser, requireAnalyst } from "@/app/_internal/session";
import type {
  AnalisisDetalleDTO,
  AnalisisStubDTO,
  PanelTotalesDTO,
  TecnicasFrecuentesDTO,
  TipoAccion,
  VistaPanel,
} from "@/app/_interfaces/analisis";
import {
  AccionRowSchema,
  DetalleRowSchema,
  EventoRowSchema,
  IndicadorRowSchema,
  StubRowSchema,
  TecnicaFrecuenteRowSchema,
  TotalesRowSchema,
} from "../_schemas/analisis-rows.schema";
import { tecnicaAttack } from "@/app/_utils/attack";
import { toDetalleDTO, toStubDTO } from "./analisis.mapper";

const QUEUE_LIMIT = 100;

/**
 * Dates are read as UNIX timestamps: the database stores DATETIME in the
 * server's local zone, and UNIX_TIMESTAMP() converts with that same zone.
 */
const STUB_COLUMNS = `
  c.id,
  c.asunto,
  c.solicitante_email,
  c.clasificacion,
  c.riesgo,
  c.attack_tecnica,
  c.estado_envio,
  UNIX_TIMESTAMP(c.fecha_analisis) AS analizado_ts,
  EXISTS (SELECT 1 FROM eventos_sistema e WHERE e.correo_id = c.id AND e.tipo = 'AMENAZA_CRITICA') AS critico,
  EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id) AS atendido,
  EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id AND a.tipo = 'ANULADO') AS anulado,
  (SELECT a.tipo FROM acciones_analista a WHERE a.correo_id = c.id ORDER BY a.fecha DESC, a.id DESC LIMIT 1) AS ultima_accion
`;

const SEVERITY_ORDER = `
  critico DESC,
  FIELD(c.clasificacion, 'PHISHING', 'SOSPECHOSO', 'NO_CONCLUYENTE', 'PROBABLEMENTE_LEGITIMO') = 0,
  FIELD(c.clasificacion, 'PHISHING', 'SOSPECHOSO', 'NO_CONCLUYENTE', 'PROBABLEMENTE_LEGITIMO'),
  c.riesgo DESC,
  c.fecha_analisis DESC
`;

/**
 * Booklet stubs. Analysts see every analysis; employees only the ones they
 * reported themselves, always newest first.
 */
export async function getAnalisisStubs(
  vista: VistaPanel,
): Promise<AnalisisStubDTO[]> {
  const user = await getCurrentUser();
  const pool = getPool();

  if (user.role === "EMPLEADO") {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ${STUB_COLUMNS} FROM correos_analizados c
       WHERE c.solicitante_email = ?
       ORDER BY c.fecha_analisis DESC
       LIMIT ${QUEUE_LIMIT}`,
      [user.email],
    );
    return rows.map((row) => toStubDTO(StubRowSchema.parse(row)));
  }

  const filter =
    vista === "pendientes"
      ? "WHERE NOT EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id)"
      : vista === "atendidos"
        ? "WHERE EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id)"
        : "";

  const order = vista === "pendientes" ? SEVERITY_ORDER : "c.fecha_analisis DESC";

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ${STUB_COLUMNS} FROM correos_analizados c
     ${filter}
     ORDER BY ${order}
     LIMIT ${QUEUE_LIMIT}`,
  );

  return rows.map((row) => toStubDTO(StubRowSchema.parse(row)));
}

/** One analysis with its evidence and stamps, or null when not visible. */
export async function getAnalisisDetalle(
  id: string,
): Promise<AnalisisDetalleDTO | null> {
  const user = await getCurrentUser();
  const pool = getPool();

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT ${STUB_COLUMNS},
       c.resumen,
       c.recomendacion,
       c.attack_evidencia,
       UNIX_TIMESTAMP(c.fecha_envio) AS enviado_ts
     FROM correos_analizados c
     WHERE c.id = ?
     LIMIT 1`,
    [id],
  );

  if (!rows[0]) {
    return null;
  }

  const row = DetalleRowSchema.parse(rows[0]);

  if (user.role === "EMPLEADO" && row.solicitante_email !== user.email) {
    return null;
  }

  const [[indicadorRows], [eventoRows], [accionRows]] = await Promise.all([
    pool.execute<RowDataPacket[]>(
      "SELECT id, descripcion FROM indicadores_phishing WHERE correo_id = ? ORDER BY id",
      [id],
    ),
    pool.execute<RowDataPacket[]>(
      "SELECT id, tipo, detalle, UNIX_TIMESTAMP(fecha) AS fecha_ts FROM eventos_sistema WHERE correo_id = ? ORDER BY fecha, id",
      [id],
    ),
    pool.execute<RowDataPacket[]>(
      `SELECT a.id, a.tipo, a.detalle, UNIX_TIMESTAMP(a.fecha) AS fecha_ts,
              COALESCE(u.nombre, u.email) AS autor
       FROM acciones_analista a
       JOIN usuarios u ON u.id = a.usuario_id
       WHERE a.correo_id = ?
       ORDER BY a.fecha, a.id`,
      [id],
    ),
  ]);

  return toDetalleDTO(
    row,
    indicadorRows.map((r) => IndicadorRowSchema.parse(r)),
    eventoRows.map((r) => EventoRowSchema.parse(r)),
    accionRows.map((r) => AccionRowSchema.parse(r)),
  );
}

/** Totals for the top bar. Analysts only; employees get null. */
export async function getPanelTotales(): Promise<PanelTotalesDTO | null> {
  const user = await getCurrentUser();

  if (user.role !== "ANALISTA") {
    return null;
  }

  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT
       SUM(c.fecha_analisis >= NOW() - INTERVAL 30 DAY) AS analizados30d,
       SUM(c.fecha_analisis >= NOW() - INTERVAL 30 DAY AND c.clasificacion = 'PHISHING') AS phishing30d,
       SUM(c.fecha_analisis >= NOW() - INTERVAL 30 DAY
           AND EXISTS (SELECT 1 FROM eventos_sistema e WHERE e.correo_id = c.id AND e.tipo = 'AMENAZA_CRITICA')) AS criticos30d,
       COUNT(DISTINCT CASE WHEN c.fecha_analisis >= NOW() - INTERVAL 30 DAY THEN c.solicitante_email END) AS reportantes30d,
       SUM(NOT EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id)) AS pendientes,
       SUM(EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id)) AS atendidos
     FROM correos_analizados c`,
  );

  const parsed = TotalesRowSchema.parse({
    analizados30d: rows[0]?.analizados30d ?? 0,
    phishing30d: rows[0]?.phishing30d ?? 0,
    criticos30d: rows[0]?.criticos30d ?? 0,
    reportantes30d: rows[0]?.reportantes30d ?? 0,
    pendientes: rows[0]?.pendientes ?? 0,
    atendidos: rows[0]?.atendidos ?? 0,
  });

  return parsed;
}

/**
 * Technique frequency across every analysis, from the analyzer's query.
 * Analysts only; analyses without a technique are counted apart, never as a bar.
 */
export async function getTecnicasFrecuentes(): Promise<TecnicasFrecuentesDTO | null> {
  const user = await getCurrentUser();

  if (user.role !== "ANALISTA") {
    return null;
  }

  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT attack_tecnica, COUNT(*) AS total
     FROM correos_analizados
     GROUP BY attack_tecnica
     ORDER BY total DESC, attack_tecnica`,
  );

  const filas: TecnicasFrecuentesDTO["filas"] = [];
  let sinTecnica = 0;

  for (const raw of rows) {
    const row = TecnicaFrecuenteRowSchema.parse(raw);
    const tecnica = tecnicaAttack(row.attack_tecnica);
    if (tecnica) {
      filas.push({ tecnica, total: row.total });
    } else {
      sinTecnica += row.total;
    }
  }

  return { filas, sinTecnica };
}

export class AccionRechazadaError extends Error {}

/** Stamps an analyst action on an analysis. A voided analysis takes no more stamps. */
export async function registrarAccion(input: {
  correoId: string;
  tipo: TipoAccion;
  detalle?: string;
}): Promise<void> {
  const analyst = await requireAnalyst();
  const pool = getPool();

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT c.id,
       EXISTS (SELECT 1 FROM acciones_analista a WHERE a.correo_id = c.id AND a.tipo = 'ANULADO') AS anulado
     FROM correos_analizados c WHERE c.id = ? LIMIT 1`,
    [input.correoId],
  );

  if (!rows[0]) {
    throw new AccionRechazadaError("El análisis ya no existe.");
  }

  if (Number(rows[0].anulado) > 0) {
    throw new AccionRechazadaError(
      "Este análisis está anulado y no admite más timbres.",
    );
  }

  await pool.execute(
    "INSERT INTO acciones_analista (correo_id, usuario_id, tipo, detalle) VALUES (?, ?, ?, ?)",
    [input.correoId, analyst.id, input.tipo, input.detalle ?? null],
  );
}
