import "server-only";

import type { PeriodoMetricas } from "@/app/_interfaces/metricas";

const ZONA = "America/Santiago";
const HORA_MS = 3_600_000;

const claveDia = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const horaCorta = new Intl.DateTimeFormat("es-CL", {
  timeZone: ZONA,
  hour: "2-digit",
  hourCycle: "h23",
});
const diaCorto = new Intl.DateTimeFormat("es-CL", {
  timeZone: ZONA,
  day: "numeric",
  month: "short",
});
const diaLargo = new Intl.DateTimeFormat("es-CL", {
  timeZone: ZONA,
  weekday: "long",
  day: "numeric",
  month: "long",
});
const mesCorto = new Intl.DateTimeFormat("es-CL", { timeZone: ZONA, month: "short" });
const mesLargo = new Intl.DateTimeFormat("es-CL", {
  timeZone: ZONA,
  month: "long",
  year: "numeric",
});

const sinPunto = (texto: string) => texto.replace(".", "");

interface Granularidad {
  /** How many buckets the window holds, the current one included. */
  cantidad: number;
  clave: (hora: number) => string;
  etiqueta: (inicio: Date) => string;
  etiquetaLarga: (inicio: Date) => string;
}

const GRANULARIDAD: Record<PeriodoMetricas, Granularidad> = {
  dia: {
    cantidad: 24,
    clave: (hora) => String(hora),
    etiqueta: (inicio) => horaCorta.format(inicio),
    etiquetaLarga: (inicio) =>
      `${sinPunto(diaCorto.format(inicio))}, ${horaCorta.format(inicio)}:00`,
  },
  semana: {
    cantidad: 7,
    clave: (hora) => claveDia.format(new Date(hora * HORA_MS)),
    etiqueta: (inicio) => sinPunto(diaCorto.format(inicio)),
    etiquetaLarga: (inicio) => diaLargo.format(inicio),
  },
  mes: {
    cantidad: 30,
    clave: (hora) => claveDia.format(new Date(hora * HORA_MS)),
    etiqueta: (inicio) => sinPunto(diaCorto.format(inicio)),
    etiquetaLarga: (inicio) => diaLargo.format(inicio),
  },
  anio: {
    cantidad: 12,
    clave: (hora) => claveDia.format(new Date(hora * HORA_MS)).slice(0, 7),
    etiqueta: (inicio) => sinPunto(mesCorto.format(inicio)),
    etiquetaLarga: (inicio) => mesLargo.format(inicio),
  },
};

export interface Bucket {
  clave: string;
  inicio: Date;
  etiqueta: string;
  etiquetaLarga: string;
}

export interface VentanaMetricas {
  /** Window start, in UNIX seconds. */
  desde: number;
  /** Window end (now), in UNIX seconds. */
  hasta: number;
  /** Start of the equally long window right before. */
  previoDesde: number;
  buckets: Bucket[];
  /** Bucket key for a UNIX hour (seconds / 3600). */
  claveDeHora: (hora: number) => string;
}

/**
 * The last 24 hours are rolling; the other windows are calendar-aligned in
 * Chile time (today plus the 6 or 29 days before, this month plus the 11
 * before) so every bar is a whole day or month. Chile's UTC offsets are whole
 * hours, so walking back hour by hour finds each boundary exactly.
 */
export function construirVentana(
  periodo: PeriodoMetricas,
  ahora: Date,
): VentanaMetricas {
  const granularidad = GRANULARIDAD[periodo];
  const horaActual = Math.floor(ahora.getTime() / HORA_MS);

  const claves: string[] = [];
  const primeraHora = new Map<string, number>();

  for (let hora = horaActual; hora > horaActual - 24 * 370; hora--) {
    const clave = granularidad.clave(hora);
    if (claves.at(-1) !== clave) {
      if (claves.length === granularidad.cantidad) break;
      claves.push(clave);
    }
    primeraHora.set(clave, hora);
  }

  claves.reverse();

  const buckets = claves.map((clave): Bucket => {
    const inicio = new Date((primeraHora.get(clave) ?? horaActual) * HORA_MS);
    return {
      clave,
      inicio,
      etiqueta: granularidad.etiqueta(inicio),
      etiquetaLarga: granularidad.etiquetaLarga(inicio),
    };
  });

  const hasta = Math.floor(ahora.getTime() / 1000);
  const desde = Math.floor(buckets[0].inicio.getTime() / 1000);

  return {
    desde,
    hasta,
    previoDesde: desde - (hasta - desde),
    buckets,
    claveDeHora: granularidad.clave,
  };
}
