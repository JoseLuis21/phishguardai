import Link from "next/link";
import { LogOut } from "lucide-react";

import { Marca } from "@/app/_components/marca";
import { ToggleTema } from "@/app/_components/toggle-tema";
import type { PanelTotalesDTO } from "@/app/_interfaces/analisis";
import type { CurrentUser } from "@/app/_interfaces/user";
import { cn } from "@/app/_utils/cn";
import { cerrarSesionAction } from "../_actions/cerrar-sesion.action";

/**
 * 30-day totals set like the carbon figures of a ticket header: tinted from the
 * carbon hue so they hold contrast on the navy shell.
 */
function TotalesBarra({ totales }: { totales: PanelTotalesDTO }) {
  const campos = [
    { label: "Analizados", valor: totales.analizados30d },
    { label: "Phishing", valor: totales.phishing30d },
    { label: "Críticas", valor: totales.criticos30d },
    { label: "Reportaron", valor: totales.reportantes30d },
  ];

  return (
    <section
      aria-label="Últimos 30 días"
      className="flex items-center gap-5 max-md:order-last max-md:w-full max-md:justify-between max-md:border-t max-md:border-shell-rule max-md:py-2.5 md:gap-6"
    >
      <p className="tab-caps shrink-0 text-[0.62rem] leading-tight text-navy-ink">
        <span className="max-md:hidden">
          Últimos
          <br />
        </span>
        30 días
      </p>
      <dl className="flex items-center gap-5 max-md:flex-1 max-md:justify-between md:gap-6">
        {campos.map((campo) => (
          <div key={campo.label} className="flex flex-col-reverse items-start">
            <dt className="tab-caps text-[0.6rem] text-navy-ink">{campo.label}</dt>
            <dd className="text-[1.45rem] leading-none font-bold text-shell-figure tabular-nums [font-stretch:75%]">
              {campo.valor}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const TAB =
  "tab-caps flex h-14 items-center border-b-[3px] px-1 pt-[3px] text-[0.78rem] transition-colors";

export function BarraSuperior({
  usuario,
  totales,
  seccion = "talonario",
}: {
  usuario: CurrentUser | null;
  totales?: PanelTotalesDTO | null;
  seccion?: "talonario" | "metricas";
}) {
  return (
    <header className="bg-shell text-white">
      <div className="flex min-h-14 flex-wrap items-center gap-x-6 px-4 sm:px-6">
        <Marca />
        <nav aria-label="Principal" className="flex gap-5 self-stretch">
          <Link
            href="/panel"
            aria-current={seccion === "talonario" ? "page" : undefined}
            className={cn(
              TAB,
              seccion === "talonario"
                ? "border-navy-ink text-white"
                : "border-transparent text-navy-ink hover:text-white",
              usuario?.role !== "ANALISTA" && "max-sm:hidden",
            )}
          >
            {usuario?.role === "EMPLEADO" ? "Mis reportes" : "Talonario"}
          </Link>
          {usuario?.role === "ANALISTA" && (
            <Link
              href="/panel/metricas"
              aria-current={seccion === "metricas" ? "page" : undefined}
              className={cn(
                TAB,
                seccion === "metricas"
                  ? "border-navy-ink text-white"
                  : "border-transparent text-navy-ink hover:text-white",
              )}
            >
              Métricas
            </Link>
          )}
        </nav>

        {totales && (
          <>
            <span aria-hidden className="hidden h-8 w-px bg-shell-rule md:block" />
            <TotalesBarra totales={totales} />
          </>
        )}

        {usuario && (
          <div className="ml-auto flex min-w-0 items-center gap-4 py-2">
            <p className="hidden min-w-0 text-right leading-tight lg:block">
              <span className="block truncate text-[0.85rem] font-semibold text-white">
                {usuario.name ?? usuario.email}
              </span>
              <span className="tab-caps block text-[0.62rem] text-navy-ink">
                {usuario.role === "ANALISTA" ? "Analista" : "Empleado"}
              </span>
            </p>
            <ToggleTema />
            <form action={cerrarSesionAction}>
              <button
                type="submit"
                className="tab-caps flex h-9 items-center gap-2 border-2 border-shell-border px-3 text-[0.72rem] text-white transition-colors hover:border-white focus-visible:outline-white"
              >
                <LogOut aria-hidden className="size-4" strokeWidth={2} />
                <span className="hidden sm:inline">Cerrar sesión</span>
                <span className="sr-only sm:hidden">Cerrar sesión</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
