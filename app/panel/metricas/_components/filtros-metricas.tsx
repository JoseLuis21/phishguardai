import Link from "next/link";
import { X } from "lucide-react";

import type {
  EstadoAtencion,
  FiltrosMetricasDTO,
  PeriodoMetricas,
} from "@/app/_interfaces/metricas";
import { CLASIFICACION_LABEL } from "@/app/_utils/analisis-labels";
import { cn } from "@/app/_utils/cn";
import { metricasHref } from "./metricas-href";

const PERIODOS: { periodo: PeriodoMetricas; label: string }[] = [
  { periodo: "dia", label: "Último día" },
  { periodo: "semana", label: "7 días" },
  { periodo: "mes", label: "30 días" },
  { periodo: "anio", label: "12 meses" },
];

export const ESTADO_LABEL: Record<EstadoAtencion, string> = {
  todos: "Todos",
  pendientes: "Por atender",
  atendidos: "Atendidos",
  anulados: "Anulados",
  busqueda_tenant: "Búsqueda en el tenant",
  bloqueados: "Dominio bloqueado",
  reenviados: "Informe reenviado",
};

/**
 * Period tabs in the booklet's tab style, plus the active classification and
 * attention filters as removable chips. The filters themselves are picked by
 * clicking a row in the breakdowns below, so every control is a plain link.
 */
export function FiltrosMetricas({ filtros }: { filtros: FiltrosMetricasDTO }) {
  const activos = [
    filtros.clasificacion !== "todas" && {
      clave: "clasificacion",
      label: `Categoría: ${CLASIFICACION_LABEL[filtros.clasificacion]}`,
      href: metricasHref(filtros, { clasificacion: "todas" }),
    },
    filtros.estado !== "todos" && {
      clave: "estado",
      label: `Estado: ${ESTADO_LABEL[filtros.estado]}`,
      href: metricasHref(filtros, { estado: "todos" }),
    },
  ].filter((filtro) => filtro !== false);

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-hairline">
      <nav aria-label="Período" className="-mb-px flex overflow-x-auto">
        {PERIODOS.map(({ periodo, label }) => {
          const activo = periodo === filtros.periodo;
          return (
            <Link
              key={periodo}
              href={metricasHref(filtros, { periodo })}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "tab-caps shrink-0 border-b-2 px-3 pt-1 pb-2.5 text-[0.75rem] whitespace-nowrap transition-colors",
                activo
                  ? "border-navy text-navy"
                  : "border-transparent text-mute hover:text-navy",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {activos.length > 0 && (
        <ul aria-label="Filtros activos" className="flex flex-wrap items-center gap-2 pb-2">
          {activos.map((filtro) => (
            <li key={filtro.clave}>
              <Link
                href={filtro.href}
                className="flex h-8 items-center gap-1.5 border border-hairline-strong bg-stock px-2.5 text-[0.8rem] text-ink transition-colors hover:border-navy"
              >
                {filtro.label}
                <X aria-hidden className="size-3.5 text-mute" />
                <span className="sr-only">(quitar filtro)</span>
              </Link>
            </li>
          ))}
          {activos.length > 1 && (
            <li>
              <Link
                href={metricasHref(filtros, { clasificacion: "todas", estado: "todos" })}
                className="px-1 text-[0.8rem] text-navy underline-offset-3 hover:underline"
              >
                Quitar todos
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
