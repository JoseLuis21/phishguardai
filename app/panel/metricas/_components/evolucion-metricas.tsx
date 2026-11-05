import type { MetricasSerieDTO, PeriodoMetricas } from "@/app/_interfaces/metricas";

const TITULO_EJE: Record<PeriodoMetricas, string> = {
  dia: "Por hora",
  semana: "Por día",
  mes: "Por día",
  anio: "Por mes",
};

/** Label every nth bar so the axis never collides. */
const CADA: Record<PeriodoMetricas, number> = { dia: 3, semana: 1, mes: 5, anio: 1 };

/**
 * Stacked columns: phishing in Jet Red at the base (red means phishing, and
 * the legend says so in words), the rest of the analyses in Carbon above it,
 * with a 2px stock gap between segments. The plot is decorative; a table
 * carries the same numbers for screen readers.
 */
export function EvolucionMetricas({
  serie,
  periodo,
}: {
  serie: MetricasSerieDTO[];
  periodo: PeriodoMetricas;
}) {
  const maximo = Math.max(0, ...serie.map((punto) => punto.total));
  const escala = Math.max(1, maximo);
  const vacio = maximo === 0;

  return (
    <section aria-labelledby="evolucion-titulo" className="coupon flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 id="evolucion-titulo" className="tab-caps text-[0.72rem] text-navy">
          Evolución de los análisis
          <span className="text-mute"> · {TITULO_EJE[periodo]}</span>
        </h2>
        <ul className="flex items-center gap-4 text-[0.75rem] text-mute">
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 bg-jet-red" />
            Phishing
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 bg-carbon" />
            Otras clasificaciones
          </li>
        </ul>
      </div>

      {vacio ? (
        <p className="py-10 text-center text-[0.88rem] text-mute">
          No hay análisis en este período con los filtros elegidos.
        </p>
      ) : (
        <div aria-hidden className="flex gap-2">
          <div className="flex h-44 flex-col justify-between pb-6 text-right">
            <span className="carbon text-[0.72rem]">{maximo}</span>
            <span className="carbon text-[0.72rem]">0</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative flex h-38 items-end gap-[3px] border-b border-hairline-strong">
              <span className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-hairline" />
              {serie.map((punto) => {
                const otras = punto.total - punto.phishing;
                return (
                  <div
                    key={punto.desde}
                    className="group relative flex h-full min-w-0 flex-1 flex-col justify-end"
                  >
                    <div className="absolute inset-0 group-hover:bg-tint" />
                    {otras > 0 && (
                      <div
                        className="relative bg-carbon group-hover:opacity-85"
                        style={{ height: `${(otras / escala) * 100}%` }}
                      />
                    )}
                    {otras > 0 && punto.phishing > 0 && (
                      <div className="relative h-[2px] shrink-0 bg-stock" />
                    )}
                    {punto.phishing > 0 && (
                      <div
                        className="relative bg-jet-red group-hover:opacity-85"
                        style={{ height: `${(punto.phishing / escala) * 100}%` }}
                      />
                    )}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 border border-hairline bg-stock px-2.5 py-1.5 text-[0.75rem] whitespace-nowrap text-ink group-hover:block">
                      <p className="font-semibold">{punto.etiquetaLarga}</p>
                      <p>
                        <span className="carbon font-semibold">{punto.total}</span> analizados ·{" "}
                        <span className="carbon font-semibold">{punto.phishing}</span> phishing
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex h-6 gap-[3px] pt-1.5">
              {serie.map((punto, indice) => (
                <span
                  key={punto.desde}
                  className="min-w-0 flex-1 text-center text-[0.68rem] whitespace-nowrap text-mute"
                >
                  {(serie.length - 1 - indice) % CADA[periodo] === 0 ? punto.etiqueta : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <table className="sr-only">
        <caption>Análisis y phishing detectado {TITULO_EJE[periodo].toLowerCase()}</caption>
        <thead>
          <tr>
            <th scope="col">Período</th>
            <th scope="col">Analizados</th>
            <th scope="col">Phishing</th>
          </tr>
        </thead>
        <tbody>
          {serie.map((punto) => (
            <tr key={punto.desde}>
              <th scope="row">{punto.etiquetaLarga}</th>
              <td>{punto.total}</td>
              <td>{punto.phishing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
