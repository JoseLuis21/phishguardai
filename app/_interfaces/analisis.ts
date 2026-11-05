import type { TecnicaAttackDTO } from "@/app/_utils/attack";

export const CLASIFICACIONES = [
  "PHISHING",
  "SOSPECHOSO",
  "PROBABLEMENTE_LEGITIMO",
  "NO_CONCLUYENTE",
] as const;

export type Clasificacion = (typeof CLASIFICACIONES)[number] | "DESCONOCIDA";

export type EstadoEnvio = "ENVIADO" | "PENDIENTE" | "FALLIDO" | "DESCONOCIDO";

export const TIPOS_ACCION = [
  "DOMINIO_BLOQUEADO",
  "BUSQUEDA_TENANT",
  "INFORME_REENVIADO",
  "ANULADO",
] as const;

export type TipoAccion = (typeof TIPOS_ACCION)[number];

export const VISTAS_PANEL = ["pendientes", "atendidos", "todos"] as const;

export type VistaPanel = (typeof VISTAS_PANEL)[number];

/** One stub in the booklet. */
export interface AnalisisStubDTO {
  id: string;
  numero: string;
  asunto: string;
  solicitante: string;
  clasificacion: Clasificacion;
  riesgo: number;
  estadoEnvio: EstadoEnvio;
  analizadoEn: string;
  critico: boolean;
  atendido: boolean;
  anulado: boolean;
  /** Latest analyst action, stamped on the stub. */
  ultimaAccion: TipoAccion | null;
  /** MITRE ATT&CK technique assigned by the analyzer, when it found one. */
  tecnica: TecnicaAttackDTO | null;
}

/** A stamp in the coupon's history: a system event or an analyst action. */
export interface TimbreDTO {
  id: string;
  origen: "SISTEMA" | "ANALISTA";
  tipo: string;
  fecha: string;
  autor: string | null;
  detalle: string | null;
}

export interface IndicadorDTO {
  id: string;
  descripcion: string;
}

export interface AnalisisDetalleDTO extends AnalisisStubDTO {
  resumen: string | null;
  recomendacion: string | null;
  enviadoEn: string | null;
  /** The analyzer's justification for the technique. */
  evidenciaAttack: string | null;
  indicadores: IndicadorDTO[];
  timbres: TimbreDTO[];
}

/** How many analyses the analyzer tagged with each technique (all time). */
export interface TecnicasFrecuentesDTO {
  filas: { tecnica: TecnicaAttackDTO; total: number }[];
  sinTecnica: number;
}

export interface PanelTotalesDTO {
  analizados30d: number;
  phishing30d: number;
  criticos30d: number;
  reportantes30d: number;
  pendientes: number;
  atendidos: number;
}
