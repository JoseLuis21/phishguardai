import type { ReactNode } from "react";

import { Sello } from "@/app/_components/sello";
import type { AnalisisDetalleDTO, TimbreDTO } from "@/app/_interfaces/analisis";
import { timbreLabel, timbreTono } from "@/app/_utils/analisis-labels";
import { cn } from "@/app/_utils/cn";
import { formatoFechaHora, formatoHora } from "@/app/_utils/fechas";
import { csfDeTimbre, NIST_CSF_URL } from "@/app/_utils/referencias";
import { AccionesCupon } from "./acciones-cupon";
import { ReferenciasCupon } from "./referencias-cupon";
import { SelloClasificacion, SelloEnvio } from "./sello-clasificacion";

/** A stamp landed in the last few seconds animates once when it appears. */
const VENTANA_ANIMACION_MS = 15_000;

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 px-4 py-3">
      <dt className="tab-caps text-[0.65rem] text-mute">{label}</dt>
      <dd className="mt-1 min-w-0 text-[0.92rem] text-ink">{children}</dd>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="tab-caps text-[0.72rem] text-navy">{titulo}</h2>
      {children}
    </section>
  );
}

const MARCADOR: Record<string, string> = {
  peligro: "bg-jet-red",
  alerta: "bg-amber",
  seguro: "bg-green",
  neutro: "bg-navy",
};

function Recorrido({
  timbres,
  estadoEnvio,
  ahora,
  esAnalista,
}: {
  timbres: TimbreDTO[];
  estadoEnvio: AnalisisDetalleDTO["estadoEnvio"];
  ahora: Date;
  esAnalista: boolean;
}) {
  const informeRegistrado = timbres.some((t) => t.tipo === "INFORME_ENVIADO");

  return (
    <ol className="relative flex flex-col gap-4 before:absolute before:top-1.5 before:bottom-1.5 before:left-[4px] before:w-px before:bg-hairline">
      {timbres.map((timbre) => {
        const reciente =
          timbre.origen === "ANALISTA" &&
          ahora.getTime() - new Date(timbre.fecha).getTime() < VENTANA_ANIMACION_MS;
        return (
          <li
            key={timbre.id}
            className={cn(
              "relative grid grid-cols-[10px_minmax(0,1fr)] gap-3",
              reciente && "timbre-in",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "relative mt-1.5 size-[9px]",
                MARCADOR[timbreTono(timbre.tipo)],
                timbre.origen === "ANALISTA" && "rotate-45",
              )}
            />
            <div className="min-w-0">
              {timbre.origen === "ANALISTA" ? (
                <Sello
                  tono={timbre.tipo === "ANULADO" ? "peligro" : "tinta"}
                  className="mb-1.5 text-[0.68rem]"
                >
                  {timbreLabel(timbre.tipo)}
                </Sello>
              ) : (
                <p className="text-[0.86rem] font-semibold text-ink">
                  {timbreLabel(timbre.tipo)}
                </p>
              )}
              <p className="text-[0.78rem] text-mute">
                <time
                  dateTime={timbre.fecha}
                  title={formatoFechaHora(timbre.fecha)}
                  className="carbon"
                >
                  {formatoHora(timbre.fecha)}
                </time>
                {timbre.origen === "ANALISTA" && timbre.autor
                  ? ` · ${timbre.autor}`
                  : " · Analizador"}
              </p>
              {timbre.detalle && (
                <p className="mt-0.5 text-[0.78rem] leading-snug break-words text-mute">
                  {timbre.detalle}
                </p>
              )}
              {esAnalista && timbre.origen === "ANALISTA" && csfDeTimbre(timbre.tipo) && (
                <p className="mt-0.5 text-[0.72rem] text-mute">
                  <a
                    href={NIST_CSF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-navy hover:underline"
                    title="Categoría de respuesta del NIST Cybersecurity Framework 2.0"
                  >
                    NIST CSF{" "}
                    <span className="carbon font-semibold">
                      {csfDeTimbre(timbre.tipo)?.codigo}
                    </span>{" "}
                    · {csfDeTimbre(timbre.tipo)?.nombre}
                  </a>
                  <span className="block">
                    Qué significa: {csfDeTimbre(timbre.tipo)?.explicacion}.
                  </span>
                </p>
              )}
            </div>
          </li>
        );
      })}
      {!informeRegistrado && estadoEnvio !== "ENVIADO" && (
        <li className="relative grid grid-cols-[10px_minmax(0,1fr)] gap-3">
          <span
            aria-hidden
            className="relative mt-1.5 size-[9px] border border-dashed border-navy bg-stock"
          />
          <p className="text-[0.86rem] font-semibold text-mute">
            {estadoEnvio === "FALLIDO" ? "Envío del informe fallido" : "Informe pendiente"}
          </p>
        </li>
      )}
    </ol>
  );
}

export function Cupon({
  analisis,
  esAnalista,
  ahora,
  tituloComo: Titulo = "h1",
  animarVeredicto = false,
}: {
  analisis: AnalisisDetalleDTO;
  esAnalista: boolean;
  ahora: Date;
  /** The landing shows a coupon under its own h1. */
  tituloComo?: "h1" | "h2";
  /** Lands the verdict stamp once, as on a freshly stamped coupon. */
  animarVeredicto?: boolean;
}) {
  const anulacion = analisis.timbres.find((t) => t.tipo === "ANULADO");
  const anulacionReciente =
    anulacion &&
    ahora.getTime() - new Date(anulacion.fecha).getTime() < VENTANA_ANIMACION_MS;

  return (
    <article
      aria-labelledby="cupon-asunto"
      className={cn(
        "relative grid min-w-0 lg:grid-cols-[minmax(0,1fr)_2px_15rem]",
        esAnalista ? "coupon" : "coupon-copy",
      )}
    >
      <div className="flex min-w-0 flex-col gap-7 p-5 sm:p-7 lg:p-8">
        <header className="flex flex-col-reverse items-start gap-5 xl:flex-row xl:justify-between xl:gap-8">
          <Titulo
            id="cupon-asunto"
            className="max-w-[34ch] text-[1.55rem] leading-[1.15] font-bold tracking-[-0.01em] text-balance text-ink sm:text-[1.75rem]"
          >
            {analisis.asunto}
          </Titulo>
          <SelloClasificacion
            analisis={analisis}
            className={cn(
              "shrink-0 border-4 xl:mt-1",
              animarVeredicto && "stamp-in [animation-delay:500ms]",
              analisis.clasificacion === "PROBABLEMENTE_LEGITIMO"
                ? "text-[1.5rem] sm:text-[1.85rem]"
                : "text-[2.1rem] sm:text-[2.7rem]",
            )}
          />
        </header>

        <div className="flex items-end gap-8 lg:hidden">
          <div>
            <p className="tab-caps text-[0.65rem] text-mute">Riesgo</p>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="carbon text-[3.4rem] leading-none font-bold [font-stretch:75%]">
                {analisis.riesgo}
              </span>
              <span className="carbon text-[0.95rem] font-semibold">/100</span>
            </p>
          </div>
          <div>
            <p className="tab-caps text-[0.65rem] text-mute">Cupón N°</p>
            <p className="carbon mt-1 text-[1.2rem] font-semibold">{analisis.numero}</p>
          </div>
        </div>

        <dl
          className={cn(
            "grid border sm:grid-cols-3 sm:divide-x",
            esAnalista
              ? "divide-hairline border-hairline max-sm:divide-y"
              : "divide-carbon-copy-rule border-carbon-copy-rule max-sm:divide-y",
          )}
        >
          <Campo label={esAnalista ? "Reportado por" : "Reportado por ti"}>
            <span className="block truncate" title={analisis.solicitante}>
              {analisis.solicitante}
            </span>
          </Campo>
          <Campo label="Analizado">
            <time dateTime={analisis.analizadoEn} className="carbon">
              {formatoFechaHora(analisis.analizadoEn)}
            </time>
          </Campo>
          <Campo label="Informe">
            <SelloEnvio estado={analisis.estadoEnvio} className="text-[0.68rem]" />
          </Campo>
        </dl>

        {anulacion && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border border-dashed border-jet-red px-4 py-3">
            <Sello
              tono="peligro"
              animar={Boolean(anulacionReciente)}
              className="border-[3px] text-[1.3rem]"
            >
              Anulado
            </Sello>
            <p className="max-w-[60ch] text-[0.88rem] leading-relaxed text-ink">
              {esAnalista ? "Marcado como falso positivo" : "El equipo de seguridad lo marcó como falso positivo"}
              {anulacion.autor && esAnalista ? ` por ${anulacion.autor}` : ""} el{" "}
              <time dateTime={anulacion.fecha}>{formatoFechaHora(anulacion.fecha)}</time>.
              {anulacion.detalle ? ` «${anulacion.detalle}»` : ""}
            </p>
          </div>
        )}

        <Seccion titulo="Resumen del análisis">
          <p className="max-w-[68ch] text-[0.98rem] leading-[1.6] text-ink">
            {analisis.resumen ?? "El analizador no generó un resumen para este correo."}
          </p>
        </Seccion>

        <Seccion
          titulo={`Indicadores encontrados · ${analisis.indicadores.length}`}
        >
          {analisis.indicadores.length === 0 ? (
            <p className="text-[0.92rem] text-mute">
              El analizador no registró indicadores para este correo.
            </p>
          ) : (
            <ul
              className={cn(
                "max-w-[78ch] border-t",
                esAnalista ? "border-hairline" : "border-carbon-copy-rule",
              )}
            >
              {analisis.indicadores.map((indicador) => (
                <li
                  key={indicador.id}
                  className={cn(
                    "grid grid-cols-[8px_minmax(0,1fr)] gap-3 border-b py-2.5 text-[0.92rem] leading-[1.5] text-ink",
                    esAnalista ? "border-hairline" : "border-carbon-copy-rule",
                  )}
                >
                  <span aria-hidden className="mt-[0.55em] size-[6px] bg-navy" />
                  <span className="break-words">{indicador.descripcion}</span>
                </li>
              ))}
            </ul>
          )}
        </Seccion>

        {esAnalista && (
          <Seccion titulo="Técnica MITRE ATT&CK">
            {analisis.tecnica ? (
              <div className="flex max-w-[78ch] flex-col gap-2.5">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <a
                    href={analisis.tecnica.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="carbon text-[1.3rem] font-bold underline-offset-[3px] hover:underline"
                  >
                    {analisis.tecnica.codigo}
                    <span className="sr-only"> (abre MITRE ATT&CK en una pestaña nueva)</span>
                  </a>
                  <span className="text-[0.95rem] font-semibold text-ink">
                    {analisis.tecnica.nombre ?? "Técnica fuera del catálogo"}
                  </span>
                  {analisis.tecnica.descripcion && (
                    <span className="text-[0.9rem] text-mute">
                      {analisis.tecnica.descripcion}
                    </span>
                  )}
                </p>
                {analisis.evidenciaAttack && (
                  <p className="max-w-[68ch] text-[0.95rem] leading-[1.6] text-ink">
                    {analisis.evidenciaAttack}
                  </p>
                )}
                <p className="text-[0.78rem] leading-snug text-mute">
                  Evaluación automatizada del analizador según la evidencia
                  disponible; no es una confirmación forense.
                </p>
              </div>
            ) : (
              <p className="max-w-[68ch] text-[0.92rem] leading-relaxed text-mute">
                Sin técnica asignada: el analizador no encontró evidencia
                suficiente para asociar este correo a una técnica ATT&CK.
              </p>
            )}
          </Seccion>
        )}

        <Seccion titulo="Qué hacer">
          <p className="max-w-[68ch] text-[0.98rem] leading-[1.6] text-ink">
            {analisis.recomendacion ??
              "El analizador no generó recomendaciones para este correo."}
          </p>
        </Seccion>

        <Seccion titulo={esAnalista ? "Marcos de referencia" : "Para saber más"}>
          <ReferenciasCupon esAnalista={esAnalista} />
        </Seccion>

        {esAnalista && !anulacion && (
          <>
            <div className="perforation-x" aria-hidden />
            <Seccion titulo="Timbrar acción">
              <AccionesCupon key={analisis.id} correoId={analisis.id} />
            </Seccion>
          </>
        )}
      </div>

      <div className="perforation-y perforation-notch hidden lg:block" aria-hidden />
      <div className="perforation-x mx-5 lg:hidden" aria-hidden />

      <aside
        aria-label="Talón del cupón"
        className="flex flex-col gap-7 p-5 sm:p-7 lg:px-6 lg:py-8"
      >
        <div className="grid gap-6 max-lg:hidden">
          <div>
            <p className="tab-caps text-[0.65rem] text-mute">Riesgo</p>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="carbon text-[4.4rem] leading-none font-bold [font-stretch:75%]">
                {analisis.riesgo}
              </span>
              <span className="carbon text-[0.95rem] font-semibold">/100</span>
            </p>
          </div>
          <div>
            <p className="tab-caps text-[0.65rem] text-mute">Cupón N°</p>
            <p className="carbon mt-1 text-[1.2rem] font-semibold">{analisis.numero}</p>
            {!esAnalista && (
              <p className="mt-2 text-[0.78rem] leading-snug text-mute">
                Copia al carbón para quien reportó.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="tab-caps text-[0.72rem] text-navy">Recorrido</h2>
          <Recorrido
            timbres={analisis.timbres}
            estadoEnvio={analisis.estadoEnvio}
            ahora={ahora}
            esAnalista={esAnalista}
          />
        </div>
      </aside>
    </article>
  );
}
