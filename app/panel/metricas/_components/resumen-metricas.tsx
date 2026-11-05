import type { MetricasResumenDTO } from "@/app/_interfaces/metricas";

function Variacion({ actual, previo }: { actual: number; previo: number }) {
  if (previo === 0) {
    return (
      <span className="text-[0.75rem] text-mute">
        {actual === 0 ? "Sin cambios" : "Sin datos del período anterior"}
      </span>
    );
  }

  const cambio = Math.round(((actual - previo) / previo) * 100);
  const texto =
    cambio === 0 ? "Igual" : `${cambio > 0 ? "+" : "−"}${Math.abs(cambio)} %`;

  return (
    <span className="text-[0.75rem] text-mute">
      <span className="carbon font-semibold">{texto}</span> vs. período
      anterior ({previo})
    </span>
  );
}

/**
 * The headline figures as one printed strip, not a row of cards: carbon
 * figures over condensed caps, divided by hairlines.
 */
export function ResumenMetricas({ resumen }: { resumen: MetricasResumenDTO }) {
  const campos = [
    {
      label: "Analizados",
      valor: resumen.analizados,
      nota: <Variacion actual={resumen.analizados} previo={resumen.analizadosPrevio} />,
    },
    {
      label: "Phishing",
      valor: resumen.phishing,
      nota: <Variacion actual={resumen.phishing} previo={resumen.phishingPrevio} />,
    },
    {
      label: "Amenazas críticas",
      valor: resumen.criticos,
      nota: null,
    },
    {
      label: "Personas que reportaron",
      valor: resumen.reportantes,
      nota: null,
    },
    {
      label: "Riesgo promedio",
      valor: resumen.riesgoPromedio,
      sufijo: "/100",
      nota: null,
    },
  ];

  return (
    <section aria-label="Resumen del período" className="coupon">
      <dl className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-3 lg:grid-cols-5">
        {campos.map((campo) => (
          <div
            key={campo.label}
            className="flex flex-col gap-1.5 bg-stock px-5 py-4 max-sm:last:col-span-2 sm:max-lg:last:col-span-2"
          >
            <dt className="tab-caps text-[0.68rem] text-mute">{campo.label}</dt>
            <dd className="flex flex-col gap-1">
              <span className="carbon text-[2.1rem] leading-none font-bold [font-stretch:75%]">
                {campo.valor ?? "—"}
                {campo.valor !== null && campo.sufijo && (
                  <span className="text-[0.95rem] font-semibold"> {campo.sufijo}</span>
                )}
              </span>
              {campo.nota}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
