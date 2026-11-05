import type { FiltrosMetricasDTO } from "@/app/_interfaces/metricas";

/** Link to the metrics sheet with some filters changed; defaults stay out of the URL. */
export function metricasHref(
  filtros: FiltrosMetricasDTO,
  cambio: Partial<FiltrosMetricasDTO> = {},
) {
  const siguiente = { ...filtros, ...cambio };
  const params = new URLSearchParams();
  if (siguiente.periodo !== "semana") params.set("periodo", siguiente.periodo);
  if (siguiente.clasificacion !== "todas") params.set("clasificacion", siguiente.clasificacion);
  if (siguiente.estado !== "todos") params.set("estado", siguiente.estado);
  const query = params.toString();
  return query ? `/panel/metricas?${query}` : "/panel/metricas";
}

export const porcentaje = (parte: number, total: number) =>
  total > 0 ? Math.round((parte / total) * 100) : 0;
