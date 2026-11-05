import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

import { getCurrentUser } from "@/app/_internal/session";
import { cn } from "@/app/_utils/cn";
import { Marca } from "@/app/_components/marca";
import { BarraSuperior } from "./_components/barra-superior";
import { Cupon } from "./_components/cupon";
import { Talonario, panelHref } from "./_components/talonario";
import { TecladoTalonario } from "./_components/teclado-talonario";
import { TecnicasFrecuentes } from "./_components/tecnicas-frecuentes";
import {
  getAnalisisDetalle,
  getAnalisisStubs,
  getPanelTotales,
  getTecnicasFrecuentes,
} from "./_internal/analisis.dal";
import { panelSearchParamsSchema } from "./_schemas/panel-search-params.schema";

export const metadata: Metadata = {
  title: "Panel",
};

export default function PanelPage({ searchParams }: PageProps<"/panel">) {
  return (
    <Suspense fallback={<PanelEsqueleto />}>
      <PanelContenido searchParams={searchParams} />
    </Suspense>
  );
}

async function PanelContenido({
  searchParams,
}: {
  searchParams: PageProps<"/panel">["searchParams"];
}) {
  const usuario = await getCurrentUser();
  const { vista, id } = panelSearchParamsSchema.parse(await searchParams);
  const esAnalista = usuario.role === "ANALISTA";

  const [stubs, totales, tecnicas] = await Promise.all([
    getAnalisisStubs(vista),
    getPanelTotales(),
    getTecnicasFrecuentes(),
  ]);

  const seleccionado = id ?? stubs[0]?.id;
  const detalle = seleccionado ? await getAnalisisDetalle(seleccionado) : null;
  const ahora = new Date();

  const hrefs = stubs.map((stub) => panelHref(vista, stub.id));
  const indiceActual = stubs.findIndex((stub) => stub.id === seleccionado);

  /* On narrow screens the booklet and the coupon take turns: an explicit id
     shows the coupon, otherwise the booklet. */
  const cuponExplicito = Boolean(id);

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraSuperior usuario={usuario} totales={esAnalista ? totales : null} seccion="talonario" />

      <main className="flex flex-1 flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(22rem,27rem)_minmax(0,1fr)]">
          <div className={cn("flex flex-col gap-6", cuponExplicito && "max-lg:hidden")}>
            <Talonario
              stubs={stubs}
              vista={vista}
              seleccionado={seleccionado}
              totales={totales}
              esAnalista={esAnalista}
              correoUsuario={usuario.email}
              ahora={ahora}
            />
            {tecnicas && <TecnicasFrecuentes datos={tecnicas} />}
          </div>

          <div className={cn("flex min-w-0 flex-col gap-3", !cuponExplicito && "max-lg:hidden")}>
            <Link
              href={panelHref(vista)}
              className="tab-caps flex items-center gap-2 self-start py-1 text-[0.75rem] text-navy lg:hidden"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Volver al talonario
            </Link>

            {detalle ? (
              <Cupon analisis={detalle} esAnalista={esAnalista} ahora={ahora} />
            ) : id ? (
              <div className="coupon px-6 py-10">
                <p className="text-[1.05rem] font-semibold text-ink">
                  No encontramos este análisis
                </p>
                <p className="mt-2 max-w-[52ch] text-[0.92rem] leading-relaxed text-mute">
                  Puede que el enlace esté incompleto o que no tengas acceso a este
                  cupón. Elige otro análisis del talonario.
                </p>
              </div>
            ) : stubs.length > 0 ? null : (
              <div className="hidden border border-dashed border-hairline px-6 py-16 text-center lg:block">
                <p className="text-[0.95rem] text-mute">
                  El cupón abierto aparecerá aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {stubs.length > 1 && indiceActual >= 0 && (
        <TecladoTalonario hrefs={hrefs} actual={indiceActual} />
      )}
    </div>
  );
}

function PanelEsqueleto() {
  return (
    <div className="flex min-h-dvh flex-col" aria-busy="true">
      <header className="bg-shell">
        <div className="flex h-14 items-center px-4 sm:px-6">
          <Marca />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
        <p className="sr-only">Cargando el talonario…</p>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(22rem,27rem)_minmax(0,1fr)]">
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="coupon h-[6.6rem] animate-pulse" />
            ))}
          </div>
          <div className="coupon hidden h-[36rem] animate-pulse lg:block" />
        </div>
      </main>
    </div>
  );
}
