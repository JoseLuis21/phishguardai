/**
 * MITRE ATT&CK techniques the analyzer may assign (closed list from the
 * "Phishing Analysis V5" database update). A code outside the list is still
 * shown and linked, just without a Spanish name.
 */
export const TECNICAS_ATTACK: Record<string, { nombre: string; descripcion: string }> = {
  "T1566.001": {
    nombre: "Spearphishing Attachment",
    descripcion: "Phishing mediante archivos adjuntos.",
  },
  "T1566.002": {
    nombre: "Spearphishing Link",
    descripcion: "Phishing mediante enlaces.",
  },
  T1598: {
    nombre: "Phishing for Information",
    descripcion: "Intentos de obtener información mediante engaño.",
  },
  T1656: {
    nombre: "Impersonation",
    descripcion: "Suplantación de identidad.",
  },
};

const CODIGO_ATTACK = /^T\d{4}(?:\.\d{3})?$/;

export interface TecnicaAttackDTO {
  codigo: string;
  nombre: string | null;
  descripcion: string | null;
  url: string;
}

/** "T1566.002" → https://attack.mitre.org/techniques/T1566/002/ */
export function urlTecnica(codigo: string): string {
  return `https://attack.mitre.org/techniques/${codigo.replace(".", "/")}/`;
}

/** Null for empty or malformed values, so nothing unlinkable reaches the UI. */
export function tecnicaAttack(raw: string | null | undefined): TecnicaAttackDTO | null {
  const codigo = raw?.trim().toUpperCase();
  if (!codigo || !CODIGO_ATTACK.test(codigo)) return null;
  const conocida = TECNICAS_ATTACK[codigo];
  return {
    codigo,
    nombre: conocida?.nombre ?? null,
    descripcion: conocida?.descripcion ?? null,
    url: urlTecnica(codigo),
  };
}
