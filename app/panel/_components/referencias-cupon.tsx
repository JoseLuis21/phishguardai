import { ArrowUpRight } from "lucide-react";

import {
  REFERENCIAS_ANALISTA,
  REFERENCIAS_EMPLEADO,
} from "@/app/_utils/referencias";
import { cn } from "@/app/_utils/cn";

/**
 * Fixed reading list, not a classification: the analyzer does not tag
 * techniques, so the coupon never says which one this email is.
 */
export function ReferenciasCupon({ esAnalista }: { esAnalista: boolean }) {
  const referencias = esAnalista ? REFERENCIAS_ANALISTA : REFERENCIAS_EMPLEADO;

  return (
    <div className="flex max-w-[78ch] flex-col gap-2">
      <p className="text-[0.85rem] leading-relaxed text-mute">
        {esAnalista
          ? "Marcos generales para documentar y responder. No son una clasificación de este correo."
          : "Guías para reconocer el próximo correo dudoso antes de abrirlo."}
      </p>
      <ul
        className={cn(
          "border-t",
          esAnalista ? "border-hairline" : "border-carbon-copy-rule",
        )}
      >
        {referencias.map((ref) => (
          <li
            key={ref.href}
            className={cn(
              "border-b",
              esAnalista ? "border-hairline" : "border-carbon-copy-rule",
            )}
          >
            <a
              href={ref.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-2.5"
            >
              <span className="min-w-0">
                <span className="tab-caps block text-[0.62rem] text-mute">
                  {ref.fuente}
                </span>
                <span className="mt-0.5 block text-[0.92rem] font-semibold text-navy underline-offset-[3px] group-hover:underline">
                  {ref.titulo}
                </span>
                <span className="mt-0.5 block text-[0.84rem] leading-snug text-mute">
                  {ref.uso}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="mt-4 size-4 text-navy transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
