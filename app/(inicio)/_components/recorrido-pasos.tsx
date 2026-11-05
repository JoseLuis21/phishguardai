"use client";

import { useEffect, useRef, useState } from "react";

import { Sello } from "@/app/_components/sello";
import { cn } from "@/app/_utils/cn";

type Paso = {
  titulo: string;
  texto: string;
  /** The journey row this step stamps onto the stub. */
  timbre: { etiqueta: string; meta: string; analista?: boolean };
};

const PASOS: Paso[] = [
  {
    titulo: "Reenvías el correo",
    texto:
      "Desde tu correo de trabajo, reenvíalo tal cual a la casilla de análisis. No hace falta cuenta ni instalar nada.",
    timbre: { etiqueta: "Reportado", meta: "Tú · reenvío" },
  },
  {
    titulo: "La IA lo analiza",
    texto:
      "Revisa la cabecera, los enlaces, los adjuntos, los dominios y el tono del mensaje, y le asigna un riesgo de 0 a 100.",
    timbre: { etiqueta: "Analizado", meta: "Analizador · Phishing (92/100)" },
  },
  {
    titulo: "Recibes el informe",
    texto:
      "Te llega por correo con el veredicto, las señales encontradas y qué hacer. Si tienes cuenta, también lo ves aquí.",
    timbre: { etiqueta: "Informe enviado", meta: "Analizador" },
  },
  {
    titulo: "Seguridad actúa y deja registro",
    texto:
      "El equipo de seguridad ve el mismo análisis, bloquea lo que haga falta y cada acción queda timbrada en el recorrido.",
    timbre: { etiqueta: "Dominio bloqueado", meta: "Equipo de seguridad", analista: true },
  },
];

/**
 * Four steps beside a sticky coupon stub whose journey fills one stamp per
 * step as the visitor scrolls, starting from the first stamp.
 */
export function RecorridoPasos() {
  // Starts at the first stamp: the visitor watches the journey fill in.
  const [activo, setActivo] = useState(0);
  const pasosRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            setActivo(Number((entrada.target as HTMLElement).dataset.paso));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const paso of pasosRef.current) if (paso) observador.observe(paso);
    return () => observador.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
      {/* Below lg the stub becomes a strip pinned under the navy bar. */}
      <div
        aria-hidden
        className="coupon sticky top-14 z-10 -mb-6 flex items-center gap-4 px-4 py-3 lg:hidden"
      >
        <span className="tab-caps shrink-0 text-[0.65rem] text-navy">Recorrido</span>
        <span className="flex shrink-0 items-center gap-1.5">
          {PASOS.map((paso, i) => (
            <span
              key={paso.titulo}
              className={cn(
                "size-[9px]",
                i <= activo ? "bg-navy" : "border border-dashed border-navy",
                i <= activo && paso.timbre.analista && "rotate-45",
                i === activo && "timbre-in",
              )}
            />
          ))}
        </span>
        <Sello key={activo} tono="tinta" className="timbre-in min-w-0 truncate text-[0.68rem]">
          {PASOS[activo].timbre.etiqueta}
        </Sello>
      </div>

      <ol className="flex flex-col">
        {PASOS.map((paso, i) => (
          <li
            key={paso.titulo}
            ref={(nodo) => {
              pasosRef.current[i] = nodo;
            }}
            data-paso={i}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-hairline py-8 lg:min-h-[19rem] lg:py-12"
          >
            <span
              aria-hidden
              className={cn(
                "carbon text-[2.1rem] leading-none font-bold transition-opacity duration-300 [font-stretch:75%]",
                i === activo ? "opacity-100" : "lg:opacity-35",
              )}
            >
              {i + 1}
            </span>
            <div>
              <h3
                className={cn(
                  "text-[1.35rem] leading-tight font-bold text-ink transition-opacity duration-300 sm:text-[1.6rem]",
                  i !== activo && "lg:opacity-55",
                )}
              >
                {paso.titulo}
              </h3>
              <p className="mt-2 max-w-[48ch] text-[1rem] leading-[1.6] text-mute">
                {paso.texto}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="hidden lg:block">
        <aside
          aria-label="Recorrido del reporte"
          className="coupon sticky top-24 flex flex-col gap-5 p-6"
        >
          <div className="flex items-baseline justify-between">
            <h3 className="tab-caps text-[0.72rem] text-navy">Recorrido</h3>
            <span className="carbon text-[0.8rem] font-semibold">N° 000128</span>
          </div>
          <ol className="relative flex flex-col gap-4 before:absolute before:top-1.5 before:bottom-1.5 before:left-[4px] before:w-px before:bg-hairline">
            {PASOS.map((paso, i) => {
              const hecho = i <= activo;
              return (
                <li
                  key={paso.titulo}
                  className={cn(
                    "relative grid grid-cols-[10px_minmax(0,1fr)] gap-3",
                    i === activo && "timbre-in",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "relative mt-1.5 size-[9px]",
                      hecho
                        ? "bg-navy"
                        : "border border-dashed border-navy bg-stock",
                      hecho && paso.timbre.analista && "rotate-45",
                    )}
                  />
                  <div className={cn("min-w-0", !hecho && "opacity-45")}>
                    {paso.timbre.analista && hecho ? (
                      <Sello tono="tinta" className="mb-1 text-[0.68rem]">
                        {paso.timbre.etiqueta}
                      </Sello>
                    ) : (
                      <p className="text-[0.86rem] font-semibold text-ink">
                        {paso.timbre.etiqueta}
                      </p>
                    )}
                    <p className="text-[0.78rem] text-mute">
                      {hecho ? paso.timbre.meta : "Pendiente"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="border-t border-hairline pt-3 text-[0.75rem] leading-snug text-mute">
            Cada paso queda registrado. Nada se borra del recorrido.
          </p>
        </aside>
      </div>
    </div>
  );
}
