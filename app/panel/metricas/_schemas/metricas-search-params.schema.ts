import { z } from "zod";

import { CLASIFICACIONES } from "@/app/_interfaces/analisis";
import { ESTADOS_ATENCION, PERIODOS_METRICAS } from "@/app/_interfaces/metricas";

const firstValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value;

export const metricasSearchParamsSchema = z.object({
  periodo: z.preprocess(firstValue, z.enum(PERIODOS_METRICAS).catch("semana")),
  clasificacion: z.preprocess(
    firstValue,
    z.enum(["todas", ...CLASIFICACIONES]).catch("todas"),
  ),
  estado: z.preprocess(firstValue, z.enum(ESTADOS_ATENCION).catch("todos")),
});

export type MetricasSearchParams = z.infer<typeof metricasSearchParamsSchema>;
