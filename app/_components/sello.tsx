import type { ReactNode } from "react";

import type { Tono } from "@/app/_utils/analisis-labels";
import { cn } from "@/app/_utils/cn";

type Linea = "continua" | "discontinua" | "tachada";

/**
 * A rubber stamp. The tone colours it, but the text and the line form
 * (solid, dashed, struck-through) always carry the state on their own.
 */
export function Sello({
  children,
  tono = "neutro",
  linea = "continua",
  animar = false,
  className,
}: {
  children: ReactNode;
  tono?: Tono | "tinta";
  linea?: Linea;
  animar?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("stamp", animar && "stamp-in", className)}
      data-tono={tono}
      data-linea={linea}
    >
      {children}
    </span>
  );
}
