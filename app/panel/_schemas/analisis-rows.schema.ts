import { z } from "zod";

/** Shapes of the rows MySQL returns. Validated before any mapping. */

const flag = z.coerce.number().transform((value) => value > 0);

export const StubRowSchema = z.object({
  id: z.coerce.string(),
  asunto: z.string(),
  solicitante_email: z.string(),
  clasificacion: z.string(),
  riesgo: z.coerce.number().int().min(0).max(100),
  estado_envio: z.string(),
  analizado_ts: z.coerce.number(),
  critico: flag,
  atendido: flag,
  anulado: flag,
  ultima_accion: z.string().nullable(),
  attack_tecnica: z.string().nullable(),
});

export const DetalleRowSchema = StubRowSchema.extend({
  resumen: z.string().nullable(),
  recomendacion: z.string().nullable(),
  enviado_ts: z.coerce.number().nullable(),
  attack_evidencia: z.string().nullable(),
});

export const TecnicaFrecuenteRowSchema = z.object({
  attack_tecnica: z.string().nullable(),
  total: z.coerce.number().int().nonnegative(),
});

export const IndicadorRowSchema = z.object({
  id: z.coerce.string(),
  descripcion: z.string(),
});

export const EventoRowSchema = z.object({
  id: z.coerce.string(),
  tipo: z.string(),
  detalle: z.string().nullable(),
  fecha_ts: z.coerce.number(),
});

export const AccionRowSchema = z.object({
  id: z.coerce.string(),
  tipo: z.string(),
  detalle: z.string().nullable(),
  fecha_ts: z.coerce.number(),
  autor: z.string().nullable(),
});

export const TotalesRowSchema = z.object({
  analizados30d: z.coerce.number(),
  phishing30d: z.coerce.number(),
  criticos30d: z.coerce.number(),
  reportantes30d: z.coerce.number(),
  pendientes: z.coerce.number(),
  atendidos: z.coerce.number(),
});

export type StubRow = z.infer<typeof StubRowSchema>;
export type DetalleRow = z.infer<typeof DetalleRowSchema>;
export type EventoRow = z.infer<typeof EventoRowSchema>;
export type AccionRow = z.infer<typeof AccionRowSchema>;
