import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/app/_utils/cn";
import { porcentaje } from "./metricas-href";

/**
 * One row of a single-hue breakdown (Technique Chart style): a stamp names
 * the category, a square Carbon bar scaled to the largest row, the count and
 * its share. The whole row is a link that applies the row as a filter.
 */
export function FilaDesglose({
  etiqueta,
  nombre,
  total,
  base,
  maximo,
  href,
  activa,
  sangria = false,
}: {
  etiqueta: ReactNode;
  /** Plain-text name for the link's accessible label. */
  nombre: string;
  total: number;
  base: number;
  maximo: number;
  href: string;
  activa: boolean;
  sangria?: boolean;
}) {
  const parte = porcentaje(total, base);

  return (
    <li>
      <Link
        href={href}
        aria-current={activa ? "true" : undefined}
        aria-label={`${nombre}: ${total} análisis, ${parte} %${activa ? " (filtro activo, clic para quitar)" : ", filtrar"}`}
        className={cn(
          "group grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)_5.5rem] items-center gap-3 border-t border-hairline px-2 py-2.5 transition-colors first:border-t-0 hover:bg-tint",
          activa && "bg-tint outline-2 -outline-offset-2 outline-navy",
          sangria && "pl-6",
        )}
      >
        <span className="min-w-0">{etiqueta}</span>
        <span aria-hidden className="h-2.5">
          <span
            className="block h-full bg-carbon group-hover:opacity-80"
            style={{ width: `${maximo > 0 ? (total / maximo) * 100 : 0}%` }}
          />
        </span>
        <span aria-hidden className="text-right text-[0.8rem] text-mute">
          <span className="carbon text-[0.9rem] font-semibold">{total}</span> · {parte} %
        </span>
      </Link>
    </li>
  );
}
