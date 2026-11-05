import type { TecnicasFrecuentesDTO } from "@/app/_interfaces/analisis";

/**
 * Single-series bar chart of ATT&CK technique counts, built as a real table
 * so the table view comes for free. One hue (carbon, the figure ink), no
 * legend, square bar ends, the count set beside each bar, and a hover note
 * with the share of tagged analyses.
 */
export function TecnicasFrecuentes({ datos }: { datos: TecnicasFrecuentesDTO }) {
  const etiquetadas = datos.filas.reduce((suma, fila) => suma + fila.total, 0);
  const maximo = Math.max(1, ...datos.filas.map((fila) => fila.total));

  return (
    <section aria-labelledby="tecnicas-titulo" className="coupon flex flex-col gap-4 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="tecnicas-titulo" className="tab-caps text-[0.72rem] text-navy">
          Técnicas MITRE ATT&amp;CK más frecuentes
        </h2>
        <span className="text-[0.72rem] text-mute">Todos los análisis</span>
      </div>

      {datos.filas.length === 0 ? (
        <p className="text-[0.88rem] leading-relaxed text-mute">
          El analizador aún no ha asignado técnicas. Aparecerán aquí cuando
          etiquete los próximos correos.
        </p>
      ) : (
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Cantidad de análisis por técnica MITRE ATT&amp;CK asignada por el analizador
          </caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Técnica</th>
              <th scope="col">Análisis</th>
            </tr>
          </thead>
          <tbody>
            {datos.filas.map(({ tecnica, total }) => {
              const porcentaje = Math.round((total / etiquetadas) * 100);
              return (
                <tr key={tecnica.codigo} className="group border-t border-hairline first:border-t-0">
                  <th scope="row" className="py-2.5 pr-3 align-top font-normal">
                    <a
                      href={tecnica.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="carbon text-[0.85rem] font-semibold hover:underline"
                    >
                      {tecnica.codigo}
                      <span className="sr-only"> (abre MITRE ATT&amp;CK en una pestaña nueva)</span>
                    </a>
                    <span className="block text-[0.75rem] leading-snug text-mute">
                      {tecnica.descripcion ?? tecnica.nombre ?? "Técnica fuera del catálogo"}
                    </span>
                  </th>
                  <td className="relative w-[55%] py-2.5 align-top">
                    <div className="flex items-center gap-2.5 pt-1">
                      <div aria-hidden className="h-2.5 flex-1">
                        <div
                          className="h-full bg-carbon transition-opacity group-hover:opacity-80"
                          style={{ width: `${(total / maximo) * 100}%` }}
                        />
                      </div>
                      <span className="carbon w-6 text-right text-[0.85rem] font-semibold">
                        {total}
                        <span className="sr-only">
                          {" "}análisis, {porcentaje}% de los que tienen técnica
                        </span>
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-full right-0 z-10 hidden border border-hairline bg-stock px-2 py-1 text-[0.72rem] whitespace-nowrap text-ink group-focus-within:block group-hover:block"
                    >
                      {total} de {etiquetadas} con técnica · {porcentaje}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {datos.sinTecnica > 0 && (
        <p className="border-t border-hairline pt-3 text-[0.75rem] leading-snug text-mute">
          {datos.sinTecnica === 1
            ? "1 análisis sin técnica asignada"
            : `${datos.sinTecnica} análisis sin técnica asignada`}{" "}
          (evidencia insuficiente o anteriores a este registro).
        </p>
      )}
    </section>
  );
}
