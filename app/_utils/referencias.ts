import type { TipoAccion } from "@/app/_interfaces/analisis";

export interface Referencia {
  fuente: string;
  titulo: string;
  uso: string;
  href: string;
}

/**
 * General frameworks for the analyst. They are fixed on purpose: the analyzer
 * does not classify techniques yet, so the panel never claims that a given
 * email maps to a specific ATT&CK technique.
 */
export const REFERENCIAS_ANALISTA: Referencia[] = [
  {
    fuente: "MITRE ATT&CK",
    titulo: "T1566 · Phishing",
    uso: "Subtécnicas por vector: adjunto (.001), enlace (.002), vía servicio (.003) y voz (.004).",
    href: "https://attack.mitre.org/techniques/T1566/",
  },
  {
    fuente: "MITRE ATT&CK",
    titulo: "T1598 · Phishing for Information",
    uso: "Cuando el correo busca credenciales o datos en vez de ejecutar código.",
    href: "https://attack.mitre.org/techniques/T1598/",
  },
  {
    fuente: "NIST",
    titulo: "SP 800-61 Rev. 3 · Respuesta a incidentes",
    uso: "Recomendaciones de respuesta alineadas con el CSF 2.0; base de los timbres.",
    href: "https://csrc.nist.gov/pubs/sp/800/61/r3/final",
  },
  {
    fuente: "NIST",
    titulo: "SP 800-177 Rev. 1 · Trustworthy Email",
    uso: "SPF, DKIM y DMARC: qué revisar cuando la autenticación no está verificada.",
    href: "https://csrc.nist.gov/pubs/sp/800/177/r1/final",
  },
];

/** Plain-language guidance in Spanish for the person who reported. */
export const REFERENCIAS_EMPLEADO: Referencia[] = [
  {
    fuente: "ANCI · Chile",
    titulo: "Ciberconsejos",
    uso: "Consejos de la Agencia Nacional de Ciberseguridad para reconocer fraudes.",
    href: "https://anci.gob.cl/ciberconsejos/",
  },
  {
    fuente: "INCIBE",
    titulo: "Phishing: cómo reconocerlo",
    uso: "Señales típicas de un correo fraudulento y qué hacer si ya hiciste clic.",
    href: "https://www.incibe.es/ciudadania/tematicas/ingenieria-social-fraudes-online/phishing",
  },
];

export const NIST_CSF_URL = "https://www.nist.gov/cyberframework";

/**
 * NIST CSF 2.0 Respond category for each analyst stamp. Derived from the
 * action type alone, so it is exact without any help from the analyzer.
 */
export const CSF_POR_ACCION: Record<
  TipoAccion,
  { codigo: string; nombre: string; explicacion: string }
> = {
  DOMINIO_BLOQUEADO: {
    codigo: "RS.MI",
    nombre: "Mitigación",
    explicacion: "contener el ataque para que no siga llegando",
  },
  BUSQUEDA_TENANT: {
    codigo: "RS.AN",
    nombre: "Análisis",
    explicacion: "entender el alcance: a quién más le llegó",
  },
  INFORME_REENVIADO: {
    codigo: "RS.CO",
    nombre: "Comunicación",
    explicacion: "avisar a quien corresponde",
  },
  ANULADO: {
    codigo: "RS.MA",
    nombre: "Gestión",
    explicacion: "validar el caso y descartarlo si fue falsa alarma",
  },
};

export function csfDeTimbre(tipo: string) {
  return tipo in CSF_POR_ACCION ? CSF_POR_ACCION[tipo as TipoAccion] : null;
}
