"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/app/_utils/cn";

const CLAVE_TEMA = "tema";

function suscribir(aviso: () => void) {
  const observador = new MutationObserver(aviso);
  observador.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observador.disconnect();
}

const esOscuro = () => document.documentElement.dataset.theme === "dark";

/** Sun/moon switch for the navy shell. The icon follows html[data-theme] via CSS. */
export function ToggleTema({ className }: { className?: string }) {
  const oscuro = useSyncExternalStore(suscribir, esOscuro, () => false);

  function alternar() {
    const siguiente = esOscuro() ? "light" : "dark";
    document.documentElement.dataset.theme = siguiente;
    try {
      localStorage.setItem(CLAVE_TEMA, siguiente);
    } catch {
      // Storage blocked: the choice lasts until the page reloads.
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={oscuro}
      aria-label="Modo oscuro"
      title={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center border-2 border-shell-border text-white transition-colors hover:border-white focus-visible:outline-white",
        className,
      )}
    >
      <Moon aria-hidden className="size-4 dark:hidden" strokeWidth={2} />
      <Sun aria-hidden className="hidden size-4 dark:block" strokeWidth={2} />
    </button>
  );
}
