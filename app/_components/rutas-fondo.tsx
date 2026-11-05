/**
 * Auth-screen ground: orthogonal mail routes run in from the page edges and a
 * short pulse travels each one, like a forwarded email on its way to the
 * analyzer. Routes stay in the margins around the centered coupon.
 */

type Ruta = {
  d: string;
  nodos: [number, number][];
  tinta: "navy" | "carbon";
  duracion: number;
  retraso: number;
};

const RUTAS: Ruta[] = [
  { d: "M0 140 H180 V0", nodos: [[180, 140]], tinta: "navy", duracion: 9, retraso: 0 },
  {
    d: "M1440 230 H1320 V60 H1210 V0",
    nodos: [[1320, 230], [1320, 60], [1210, 60]],
    tinta: "carbon",
    duracion: 12,
    retraso: 2.5,
  },
  {
    d: "M0 600 H110 V740 H230 V900",
    nodos: [[110, 600], [110, 740], [230, 740]],
    tinta: "navy",
    duracion: 11,
    retraso: 1,
  },
  {
    d: "M1440 640 H1330 V820 H1180 V900",
    nodos: [[1330, 640], [1330, 820], [1180, 820]],
    tinta: "navy",
    duracion: 13,
    retraso: 4,
  },
  { d: "M0 330 H70 V470 H0", nodos: [[70, 330], [70, 470]], tinta: "carbon", duracion: 10, retraso: 6 },
  { d: "M470 0 V100 H690", nodos: [[470, 100], [690, 100]], tinta: "navy", duracion: 9, retraso: 3.5 },
  { d: "M1000 900 V800 H820", nodos: [[1000, 800], [820, 800]], tinta: "carbon", duracion: 10, retraso: 5 },
  { d: "M1440 420 H1250 V520 H1440", nodos: [[1250, 420], [1250, 520]], tinta: "navy", duracion: 14, retraso: 7.5 },
];

const TINTA = { navy: "var(--navy)", carbon: "var(--carbon)" };

export function RutasFondo({ className }: { className?: string }) {
  return (
    <div className={["rutas-fondo", className].filter(Boolean).join(" ")} aria-hidden>
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        fill="none"
      >
        {RUTAS.map((ruta) => (
          <g key={ruta.d}>
            <path
              d={ruta.d}
              stroke="var(--hairline)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={ruta.d}
              pathLength={100}
              stroke={TINTA[ruta.tinta]}
              strokeWidth={1.5}
              strokeLinecap="square"
              vectorEffect="non-scaling-stroke"
              className="ruta-pulso"
              style={{
                animationDuration: `${ruta.duracion}s`,
                animationDelay: `${ruta.retraso}s`,
              }}
            />
            {ruta.nodos.map(([x, y]) => (
              <rect
                key={`${x}-${y}`}
                x={x - 2.5}
                y={y - 2.5}
                width={5}
                height={5}
                fill="var(--hairline)"
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
