import type { Clasificacion, EstadoEnvio } from "@/app/_interfaces/analisis";

export type Tono = "peligro" | "alerta" | "seguro" | "neutro";

export const CLASIFICACION_LABEL: Record<Clasificacion, string> = {
  PHISHING: "Phishing",
  SOSPECHOSO: "Sospechoso",
  PROBABLEMENTE_LEGITIMO: "Probablemente legítimo",
  NO_CONCLUYENTE: "No concluyente",
  DESCONOCIDA: "Sin clasificar",
};

export const CLASIFICACION_TONO: Record<Clasificacion, Tono> = {
  PHISHING: "peligro",
  SOSPECHOSO: "alerta",
  PROBABLEMENTE_LEGITIMO: "seguro",
  NO_CONCLUYENTE: "neutro",
  DESCONOCIDA: "neutro",
};

export const ESTADO_ENVIO_LABEL: Record<EstadoEnvio, string> = {
  ENVIADO: "Informe enviado",
  PENDIENTE: "Informe pendiente",
  FALLIDO: "Envío fallido",
  DESCONOCIDO: "Envío sin estado",
};

const TIMBRE_LABEL: Record<string, string> = {
  ANALISIS_FINALIZADO: "Analizado",
  PHISHING_DETECTADO: "Phishing detectado",
  AMENAZA_CRITICA: "Amenaza crítica",
  INFORME_ENVIADO: "Informe enviado",
  DOMINIO_BLOQUEADO: "Dominio bloqueado",
  BUSQUEDA_TENANT: "Búsqueda en el tenant",
  INFORME_REENVIADO: "Informe reenviado",
  ANULADO: "Anulado",
};

export function timbreLabel(tipo: string): string {
  return (
    TIMBRE_LABEL[tipo] ??
    tipo
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^./, (c) => c.toUpperCase())
  );
}

export function timbreTono(tipo: string): Tono {
  if (["PHISHING_DETECTADO", "AMENAZA_CRITICA", "ANULADO"].includes(tipo)) {
    return "peligro";
  }
  return "neutro";
}
