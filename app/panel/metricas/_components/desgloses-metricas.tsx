import type { ReactNode } from "react";

import { Sello } from "@/app/_components/sello";
import type {
  EstadoAtencion,
  FiltrosMetricasDTO,
  MetricasAtencionDTO,
  MetricasClasificacionDTO,
  MetricasReportanteDTO,
} from "@/app/_interfaces/metricas";
import { CLASIFICACION_LABEL, CLASIFICACION_TONO } from "@/app/_utils/analisis-labels";
import { ESTADO_LABEL } from "./filtros-metricas";
import { FilaDesglose } from "./fila-desglose";
import { metricasHref } from "./metricas-href";

function Encabezado({ id, titulo, nota }: { id: string; titulo: string; nota: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h2 id={id} className="tab-caps text-[0.72rem] text-navy">
        {titulo}
      </h2>
      <span className="text-[0.72rem] text-mute">{nota}</span>
    </div>
  );
}

export function ClasificacionMetricas({
  datos,
  filtros,
}: {
  datos: MetricasClasificacionDTO[];
  filtros: FiltrosMetricasDTO;
}) {
  const base = datos.reduce((suma, fila) => suma + fila.total, 0);
  const maximo = Math.max(0, ...datos.map((fila) => fila.total));

  return (
    <section aria-labelledby="clasificacion-titulo" className="coupon flex flex-col gap-3 p-5">
      <Encabezado
        id="clasificacion-titulo"
        titulo="Por categoría"
        nota="Clic en una fila para filtrar"
      />
      <ul>
        {datos.map(({ clasificacion, total }) => {
          if (clasificacion === "DESCONOCIDA") {
            return (
              <li
                key={clasificacion}
                className="border-t border-hairline px-2 py-2.5 text-[0.8rem] text-mute"
              >
                <span className="carbon font-semibold">{total}</span> sin clasificar
              </li>
            );
          }
          const activa = filtros.clasificacion === clasificacion;
          return (
            <FilaDesglose
              key={clasificacion}
              nombre={CLASIFICACION_LABEL[clasificacion]}
              etiqueta={
                <Sello tono={CLASIFICACION_TONO[clasificacion]} className="text-[0.66rem]">
                  {CLASIFICACION_LABEL[clasificacion]}
                </Sello>
              }
              total={total}
              base={base}
              maximo={maximo}
              activa={activa}
              href={metricasHref(filtros, {
                clasificacion: activa ? "todas" : clasificacion,
              })}
            />
          );
        })}
      </ul>
    </section>
  );
}

const ACCIONES: {
  estado: Exclude<EstadoAtencion, "todos" | "pendientes" | "atendidos">;
  tono: "tinta" | "peligro";
}[] = [
  { estado: "bloqueados", tono: "tinta" },
  { estado: "busqueda_tenant", tono: "tinta" },
  { estado: "reenviados", tono: "tinta" },
  { estado: "anulados", tono: "peligro" },
];

export function AtencionMetricas({
  datos,
  filtros,
}: {
  datos: MetricasAtencionDTO;
  filtros: FiltrosMetricasDTO;
}) {
  const maximo = Math.max(datos.pendientes, datos.atendidos);

  const fila = (
    estado: Exclude<EstadoAtencion, "todos">,
    sello: ReactNode,
    sangria = false,
  ) => {
    const activa = filtros.estado === estado;
    return (
      <FilaDesglose
        key={estado}
        nombre={ESTADO_LABEL[estado]}
        etiqueta={sello}
        total={datos[estado]}
        base={datos.total}
        maximo={maximo}
        activa={activa}
        sangria={sangria}
        href={metricasHref(filtros, { estado: activa ? "todos" : estado })}
      />
    );
  };

  return (
    <section aria-labelledby="atencion-titulo" className="coupon flex flex-col gap-3 p-5">
      <Encabezado
        id="atencion-titulo"
        titulo="Atención del equipo"
        nota={`${datos.total} análisis en el período`}
      />
      <ul>
        {fila(
          "pendientes",
          <Sello tono="neutro" linea="discontinua" className="text-[0.66rem]">
            Por atender
          </Sello>,
        )}
        {fila(
          "atendidos",
          <Sello tono="tinta" className="text-[0.66rem]">
            Atendidos
          </Sello>,
        )}
        {ACCIONES.map(({ estado, tono }) =>
          fila(
            estado,
            <Sello tono={tono} className="text-[0.66rem]">
              {ESTADO_LABEL[estado]}
            </Sello>,
            true,
          ),
        )}
      </ul>
      <p className="border-t border-hairline pt-3 text-[0.75rem] leading-snug text-mute">
        Un análisis atendido puede llevar varios timbres, así que las acciones no
        suman el total de atendidos.
      </p>
    </section>
  );
}

export function ReportantesMetricas({ datos }: { datos: MetricasReportanteDTO[] }) {
  return (
    <section aria-labelledby="reportantes-titulo" className="coupon flex flex-col gap-3 p-5">
      <Encabezado
        id="reportantes-titulo"
        titulo="Quiénes más reportan"
        nota="Con los filtros aplicados"
      />
      {datos.length === 0 ? (
        <p className="text-[0.88rem] text-mute">Nadie reportó correos en este período.</p>
      ) : (
        <table className="w-full border-collapse text-left text-[0.85rem]">
          <caption className="sr-only">Personas con más correos reportados</caption>
          <thead>
            <tr className="tab-caps text-[0.64rem] text-mute">
              <th scope="col" className="pb-2 font-[inherit]">Persona</th>
              <th scope="col" className="w-20 pb-2 text-right font-[inherit]">Reportes</th>
              <th scope="col" className="w-20 pb-2 text-right font-[inherit]">Phishing</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((fila) => (
              <tr key={fila.email} className="border-t border-hairline">
                <th
                  scope="row"
                  className="py-2 pr-3 font-normal text-ink [overflow-wrap:anywhere]"
                >
                  {fila.email}
                </th>
                <td className="carbon py-2 text-right font-semibold">{fila.total}</td>
                <td className="carbon py-2 text-right font-semibold">{fila.phishing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
