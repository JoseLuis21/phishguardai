import Link from "next/link";

import { CopiarCorreo } from "@/app/_components/copiar-correo";
import { Sello } from "@/app/_components/sello";
import type {
  AnalisisStubDTO,
  PanelTotalesDTO,
  VistaPanel,
} from "@/app/_interfaces/analisis";
import { cn } from "@/app/_utils/cn";
import { timbreLabel } from "@/app/_utils/analisis-labels";
import { formatoFechaHora, formatoTranscurrido } from "@/app/_utils/fechas";
import { ActualizarTalonario } from "./actualizar-talonario";
import { SelloClasificacion } from "./sello-clasificacion";

export function panelHref(vista: VistaPanel, id?: string) {
  const params = new URLSearchParams({ vista });
  if (id) params.set("id", id);
  return `/panel?${params.toString()}`;
}

const VISTAS: { vista: VistaPanel; label: string }[] = [
  { vista: "pendientes", label: "Por atender" },
  { vista: "atendidos", label: "Atendidos" },
  { vista: "todos", label: "Todos" },
];

const VACIO: Record<VistaPanel, { titulo: string; texto: string }> = {
  pendientes: {
    titulo: "Nada por atender",
    texto:
      "Todos los análisis tienen al menos un timbre de un analista. Los nuevos correos reportados aparecerán aquí.",
  },
  atendidos: {
    titulo: "Aún no hay análisis atendidos",
    texto:
      "Cuando timbres una acción sobre un análisis (un bloqueo, una búsqueda o una anulación), pasará a esta pestaña.",
  },
  todos: {
    titulo: "Aún no hay análisis",
    texto:
      "Los correos reenviados a analisis.phishing@coplex.cl aparecerán aquí cuando el analizador termine de procesarlos.",
  },
};

export function Talonario({
  stubs,
  vista,
  seleccionado,
  totales,
  esAnalista,
  correoUsuario,
  ahora,
}: {
  stubs: AnalisisStubDTO[];
  vista: VistaPanel;
  seleccionado: string | undefined;
  totales: PanelTotalesDTO | null;
  esAnalista: boolean;
  correoUsuario: string;
  ahora: Date;
}) {
  return (
    <section aria-labelledby="talonario-titulo" className="flex min-w-0 flex-col">
      <div className="flex items-center justify-between gap-4 pb-3">
        <h2
          id="talonario-titulo"
          className="tab-caps text-[0.78rem] text-mute"
        >
          {esAnalista ? "Talonario" : "Tus reportes"}
        </h2>
        <div className="flex items-center gap-5">
        {stubs.length > 1 && (
          <p className="hidden items-center gap-1.5 text-[0.75rem] text-mute xl:flex">
            <kbd className="carbon border border-hairline bg-stock px-1.5 text-[0.7rem] font-semibold">
              J
            </kbd>
            <kbd className="carbon border border-hairline bg-stock px-1.5 text-[0.7rem] font-semibold">
              K
            </kbd>
            para moverte
          </p>
        )}
        <ActualizarTalonario
          cantidad={
            esAnalista && totales
              ? totales.pendientes + totales.atendidos
              : stubs.length
          }
          consultadoEn={ahora.toISOString()}
        />
        </div>
      </div>

      {esAnalista && totales && (
        <nav aria-label="Vistas del talonario" className="mb-3 flex border-b border-hairline">
          {VISTAS.map(({ vista: v, label }) => {
            const cantidad =
              v === "pendientes"
                ? totales.pendientes
                : v === "atendidos"
                  ? totales.atendidos
                  : totales.pendientes + totales.atendidos;
            const activa = v === vista;
            return (
              <Link
                key={v}
                href={panelHref(v)}
                aria-current={activa ? "page" : undefined}
                className={cn(
                  "tab-caps -mb-px flex items-center gap-2 border-b-2 px-3 pt-1 pb-2.5 text-[0.75rem] transition-colors",
                  activa
                    ? "border-navy text-navy"
                    : "border-transparent text-mute hover:text-navy",
                )}
              >
                {label}
                <span className="carbon text-[0.8rem] tracking-normal">{cantidad}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {stubs.length === 0 ? (
        <div className="coupon px-5 py-8">
          <p className="text-[1rem] font-semibold text-ink">
            {esAnalista ? VACIO[vista].titulo : "Aún no has reportado correos"}
          </p>
          {esAnalista ? (
            <p className="mt-2 max-w-[44ch] text-[0.9rem] leading-relaxed text-mute">
              {VACIO[vista].texto}
            </p>
          ) : (
            <>
              <p className="mt-2 max-w-[46ch] text-[0.9rem] leading-relaxed text-mute">
                Si recibes un correo dudoso, reenvíalo a esta dirección desde{" "}
                <span className="carbon font-semibold [overflow-wrap:anywhere]">
                  {correoUsuario}
                </span>
                , el correo con el que te registraste. Solo así su informe
                aparecerá aquí.
              </p>
              <CopiarCorreo className="mt-4 max-w-[46ch]" />
            </>
          )}
        </div>
      ) : (
        <>
        {!esAnalista && (
          <aside
            aria-labelledby="reportar-otro-titulo"
            className="mb-3 border border-hairline bg-stock px-4 py-3"
          >
            <h3
              id="reportar-otro-titulo"
              className="tab-caps text-[0.7rem] text-navy"
            >
              ¿Otro correo dudoso?
            </h3>
            <p className="mt-1 text-[0.85rem] leading-relaxed text-mute">
              Reenvíalo desde{" "}
              <span className="carbon font-semibold [overflow-wrap:anywhere]">
                {correoUsuario}
              </span>{" "}
              a:
            </p>
            <CopiarCorreo className="mt-2" />
          </aside>
        )}
        <ol className="flex flex-col gap-2" aria-label="Análisis">
          {stubs.map((stub) => {
            const activo = stub.id === seleccionado;
            return (
              <li key={stub.id}>
                <Link
                  href={panelHref(vista, stub.id)}
                  aria-current={activo ? "true" : undefined}
                  scroll={false}
                  className={cn(
                    "relative grid grid-cols-[minmax(0,1fr)_2px_5rem] border bg-stock transition-[border-color,background-color] duration-150",
                    stub.critico && !stub.anulado && "notch-critico",
                    activo
                      ? "border-navy bg-field outline outline-1 outline-navy"
                      : "border-hairline hover:border-hairline-strong",
                    stub.anulado && "opacity-75",
                  )}
                >
                  <div className="min-w-0 px-4 py-3">
                    <p className="flex min-w-0 items-center gap-1.5 text-[0.8rem] text-mute">
                      {esAnalista && <span className="truncate">{stub.solicitante}</span>}
                      {esAnalista && <span aria-hidden>·</span>}
                      <time
                        dateTime={stub.analizadoEn}
                        title={formatoFechaHora(stub.analizadoEn)}
                        className="shrink-0"
                      >
                        {formatoTranscurrido(stub.analizadoEn, ahora)}
                      </time>
                    </p>
                    <p className="mt-1 truncate text-[0.95rem] font-semibold text-ink">
                      {stub.asunto}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[0.68rem]">
                      <SelloClasificacion analisis={stub} />
                      {stub.critico && !stub.anulado && (
                        <Sello tono="peligro">Crítica</Sello>
                      )}
                      {stub.anulado ? (
                        <Sello tono="neutro">Anulado</Sello>
                      ) : stub.ultimaAccion ? (
                        <Sello tono="tinta">{timbreLabel(stub.ultimaAccion)}</Sello>
                      ) : null}
                      {esAnalista && stub.tecnica && (
                        <span
                          className="carbon border border-hairline px-1.5 py-px text-[0.72rem] font-semibold"
                          title={`MITRE ATT&CK ${stub.tecnica.codigo}${stub.tecnica.nombre ? ` · ${stub.tecnica.nombre}` : ""}`}
                        >
                          <span className="sr-only">Técnica MITRE ATT&CK </span>
                          {stub.tecnica.codigo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="perforation-y my-2" aria-hidden />
                  <div className="flex flex-col items-center justify-center gap-0.5 py-3">
                    <span className="carbon text-[2.1rem] leading-none font-bold [font-stretch:75%]">
                      {stub.riesgo}
                    </span>
                    <span className="tab-caps text-[0.6rem] text-mute">Riesgo</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
        </>
      )}
    </section>
  );
}
