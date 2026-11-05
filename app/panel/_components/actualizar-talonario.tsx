"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { cn } from "@/app/_utils/cn";
import { formatoHora } from "@/app/_utils/fechas";

const INTERVALO_MS = 60_000;

/**
 * Re-reads the booklet from the server: on demand, and once a minute while
 * the tab is visible. A hidden tab skips its ticks and catches up when the
 * person comes back.
 */
export function ActualizarTalonario({
  cantidad,
  consultadoEn,
}: {
  /** Stubs in the current view, to announce new arrivals. */
  cantidad: number;
  /** Server render time of the data on screen. */
  consultadoEn: string;
}) {
  const router = useRouter();
  const [buscando, startTransition] = useTransition();
  // Count the person has already seen; anything above it is new.
  const [vistos, setVistos] = useState(cantidad);
  const ultimaConsulta = useRef(Date.parse(consultadoEn));
  const nuevos = Math.max(0, cantidad - vistos);

  useEffect(() => {
    ultimaConsulta.current = Date.parse(consultadoEn);
  }, [consultadoEn]);

  useEffect(() => {
    function consultar() {
      ultimaConsulta.current = Date.now();
      startTransition(() => router.refresh());
    }

    const intervalo = window.setInterval(() => {
      if (document.visibilityState === "visible") consultar();
    }, INTERVALO_MS);

    function alVolver() {
      if (
        document.visibilityState === "visible" &&
        Date.now() - ultimaConsulta.current >= INTERVALO_MS
      ) {
        consultar();
      }
    }

    document.addEventListener("visibilitychange", alVolver);
    return () => {
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [router]);

  function buscarAhora() {
    setVistos(cantidad);
    ultimaConsulta.current = Date.now();
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center gap-2.5">
      <p aria-live="polite" className="text-right text-[0.72rem] leading-tight text-mute">
        {nuevos > 0 ? (
          <span className="font-semibold text-navy">
            {nuevos === 1 ? "1 reporte nuevo" : `${nuevos} reportes nuevos`}
          </span>
        ) : buscando ? (
          "Buscando…"
        ) : (
          <>
            Revisado a las{" "}
            <time dateTime={consultadoEn} className="carbon">
              {formatoHora(consultadoEn)}
            </time>
          </>
        )}
      </p>
      <button
        type="button"
        onClick={buscarAhora}
        disabled={buscando}
        aria-label="Buscar reportes nuevos"
        title="Buscar reportes nuevos (se revisa solo cada minuto)"
        className="flex size-8 shrink-0 items-center justify-center border-2 border-navy text-navy transition-colors hover:bg-navy hover:text-on-navy disabled:cursor-progress disabled:opacity-60"
      >
        <RefreshCw
          aria-hidden
          className={cn("size-3.5", buscando && "animate-spin motion-reduce:animate-none")}
          strokeWidth={2.25}
        />
      </button>
    </div>
  );
}
