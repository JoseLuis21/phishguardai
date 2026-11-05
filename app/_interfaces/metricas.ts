import type { Clasificacion } from "@/app/_interfaces/analisis";

/** Time windows of the metrics sheet. */
export const PERIODOS_METRICAS = ["dia", "semana", "mes", "anio"] as const;

export type PeriodoMetricas = (typeof PERIODOS_METRICAS)[number];

/** Attention state of an analysis, derived from the analyst stamps. */
export const ESTADOS_ATENCION = [
  "todos",
  "pendientes",
  "atendidos",
  "anulados",
  "busqueda_tenant",
  "bloqueados",
  "reenviados",
] as const;

export type EstadoAtencion = (typeof ESTADOS_ATENCION)[number];

/** "todas" or one known classification. */
export type FiltroClasificacion = "todas" | Exclude<Clasificacion, "DESCONOCIDA">;

export interface FiltrosMetricasDTO {
  periodo: PeriodoMetricas;
  clasificacion: FiltroClasificacion;
  estado: EstadoAtencion;
}

export interface MetricasResumenDTO {
  analizados: number;
  phishing: number;
  criticos: number;
  reportantes: number;
  /** Mean risk 0–100, null when there are no analyses. */
  riesgoPromedio: number | null;
  /** Same figures for the window right before, to compare against. */
  analizadosPrevio: number;
  phishingPrevio: number;
}

/** Counts per attention state; ignores the state filter so all can be compared. */
export type MetricasAtencionDTO = Record<Exclude<EstadoAtencion, "todos">, number> & {
  total: number;
};

export interface MetricasClasificacionDTO {
  clasificacion: Clasificacion;
  total: number;
}

export interface MetricasSerieDTO {
  /** Bucket start as ISO date. */
  desde: string;
  etiqueta: string;
  etiquetaLarga: string;
  total: number;
  phishing: number;
}

export interface MetricasReportanteDTO {
  email: string;
  total: number;
  phishing: number;
}

export interface MetricasDTO {
  filtros: FiltrosMetricasDTO;
  desde: string;
  hasta: string;
  resumen: MetricasResumenDTO;
  atencion: MetricasAtencionDTO;
  /** Ignores the classification filter so all classes can be compared. */
  porClasificacion: MetricasClasificacionDTO[];
  serie: MetricasSerieDTO[];
  reportantes: MetricasReportanteDTO[];
}
