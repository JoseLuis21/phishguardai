const ZONA = "America/Santiago";

const fechaHora = new Intl.DateTimeFormat("es-CL", {
  timeZone: ZONA,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const hora = new Intl.DateTimeFormat("es-CL", {
  timeZone: ZONA,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const fechaCorta = new Intl.DateTimeFormat("es-CL", {
  timeZone: ZONA,
  day: "numeric",
  month: "short",
});

const diaClave = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "2 nov 2026, 16:57" in Chile time. */
export function formatoFechaHora(iso: string): string {
  return fechaHora.format(new Date(iso));
}

/** "16:57" in Chile time. */
export function formatoHora(iso: string): string {
  return hora.format(new Date(iso));
}

/**
 * Compact elapsed time for the booklet: "hace 6 min", "hace 3 h",
 * "ayer 16:57", "28 oct".
 */
export function formatoTranscurrido(iso: string, ahora: Date): string {
  const fecha = new Date(iso);
  const minutos = Math.max(
    0,
    Math.floor((ahora.getTime() - fecha.getTime()) / 60_000),
  );

  if (minutos < 1) return "recién";
  if (minutos < 60) return `hace ${minutos} min`;
  if (minutos < 60 * 12) return `hace ${Math.round(minutos / 60)} h`;

  const hoy = diaClave.format(ahora);
  const ayer = diaClave.format(new Date(ahora.getTime() - 86_400_000));
  const dia = diaClave.format(fecha);

  if (dia === hoy) return `hoy ${hora.format(fecha)}`;
  if (dia === ayer) return `ayer ${hora.format(fecha)}`;
  return fechaCorta.format(fecha).replace(".", "");
}
