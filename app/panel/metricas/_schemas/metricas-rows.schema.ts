import { z } from "zod";

/** Shapes of the aggregate rows MySQL returns. SUM() over no rows is NULL. */

const conteo = z.coerce.number().int().nonnegative().nullable().transform((v) => v ?? 0);

export const ResumenRowSchema = z.object({
  analizados: conteo,
  phishing: conteo,
  criticos: conteo,
  reportantes: conteo,
  riesgo_promedio: z.coerce.number().nullable(),
  total: conteo,
  pendientes: conteo,
  atendidos: conteo,
  anulados: conteo,
  busqueda_tenant: conteo,
  bloqueados: conteo,
  reenviados: conteo,
});

export const PrevioRowSchema = z.object({
  analizados: conteo,
  phishing: conteo,
});

export const ClasificacionRowSchema = z.object({
  clasificacion: z.string(),
  total: conteo,
});

export const SerieRowSchema = z.object({
  hora: z.coerce.number().int(),
  total: conteo,
  phishing: conteo,
});

export const ReportanteRowSchema = z.object({
  email: z.string(),
  total: conteo,
  phishing: conteo,
});
