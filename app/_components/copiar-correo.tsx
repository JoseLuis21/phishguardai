"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/app/_components/ui/button";
import { CORREO_REPORTE } from "@/app/_utils/correo-reporte";
import { cn } from "@/app/_utils/cn";

type Estado = "inicial" | "copiado" | "fallo";

/** The report address on its own line, with a button to copy it. */
export function CopiarCorreo({
  correo = CORREO_REPORTE,
  grande = false,
  className,
}: {
  correo?: string;
  /** Hero-sized field for the landing. */
  grande?: boolean;
  className?: string;
}) {
  const [local, dominio] = correo.split("@");
  const [estado, setEstado] = useState<Estado>("inicial");
  const textoRef = useRef<HTMLSpanElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  async function copiar() {
    clearTimeout(temporizador.current);

    try {
      await navigator.clipboard.writeText(correo);
      setEstado("copiado");
      temporizador.current = setTimeout(() => setEstado("inicial"), 2000);
    } catch {
      // Clipboard blocked: select the address so Ctrl/Cmd+C still works.
      const nodo = textoRef.current;
      if (nodo) window.getSelection()?.selectAllChildren(nodo);
      setEstado("fallo");
    }
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border bg-stock",
          grande
            ? "border-2 border-navy py-2 pr-2 pl-4"
            : "border-hairline py-1.5 pr-1.5 pl-3",
        )}
      >
        {/* Breaks only after the @, never mid-word; the button wraps below instead. */}
        <span
          ref={textoRef}
          className={cn(
            "carbon font-semibold",
            grande ? "text-[1.2rem] sm:text-[1.4rem]" : "text-[0.95rem]",
          )}
        >
          {local}
          {dominio ? (
            <>
              @<wbr />
              {dominio}
            </>
          ) : null}
        </span>
        <Button
          type="button"
          variant={grande ? "default" : "outline"}
          size={grande ? "lg" : "sm"}
          onClick={copiar}
          aria-label={`Copiar ${correo}`}
        >
          {estado === "copiado" ? <Check aria-hidden /> : <Copy aria-hidden />}
          {estado === "copiado" ? "Copiado" : "Copiar"}
        </Button>
      </div>
      {/* The button label already shows "Copiado"; this announces it. */}
      <p
        aria-live="polite"
        className={cn(
          "text-[0.8rem] text-mute empty:hidden",
          estado === "copiado" && "sr-only",
        )}
      >
        {estado === "copiado"
          ? "Dirección copiada."
          : estado === "fallo"
            ? "No pudimos copiar. La dirección quedó seleccionada: usa Ctrl+C o Cmd+C."
            : ""}
      </p>
    </div>
  );
}
