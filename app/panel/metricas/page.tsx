import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Marca } from "@/app/_components/marca";
import { getCurrentUser } from "@/app/_internal/session";
import { formatoFechaHora } from "@/app/_utils/fechas";
import { BarraSuperior } from "../_components/barra-superior";
import {
  AtencionMetricas,
  ClasificacionMetricas,
  ReportantesMetricas,
} from "./_components/desgloses-metricas";
import { EvolucionMetricas } from "./_components/evolucion-metricas";
import { FiltrosMetricas } from "./_components/filtros-metricas";
import { ResumenMetricas } from "./_components/resumen-metricas";
import { getMetricas } from "./_internal/metricas.dal";
import { metricasSearchParamsSchema } from "./_schemas/metricas-search-params.schema";

export const metadata: Metadata = {
  title: "Métricas",
};

export default function MetricasPage({ searchParams }: PageProps<"/panel/metricas">) {
  return (
    <Suspense fallback={<MetricasEsqueleto />}>
      <MetricasContenido searchParams={searchParams} />
    </Suspense>
  );
}

async function MetricasContenido({
  searchParams,
}: {
  searchParams: PageProps<"/panel/metricas">["searchParams"];
}) {
  const usuario = await getCurrentUser();

  if (usuario.role !== "ANALISTA") {
    redirect("/panel");
  }

  const filtros = metricasSearchParamsSchema.parse(await searchParams);
  const metricas = await getMetricas(filtros, new Date());

  if (!metricas) {
    redirect("/panel");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraSuperior usuario={usuario} seccion="metricas" />

      <main className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="text-[1.3rem] font-bold text-ink">Métricas</h1>
          <p className="text-[0.8rem] text-mute">
            Del <span className="carbon">{formatoFechaHora(metricas.desde)}</span> al{" "}
            <span className="carbon">{formatoFechaHora(metricas.hasta)}</span>
          </p>
        </div>

        <FiltrosMetricas filtros={metricas.filtros} />
        <ResumenMetricas resumen={metricas.resumen} />
        <EvolucionMetricas serie={metricas.serie} periodo={metricas.filtros.periodo} />

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <ClasificacionMetricas datos={metricas.porClasificacion} filtros={metricas.filtros} />
          <AtencionMetricas datos={metricas.atencion} filtros={metricas.filtros} />
        </div>

        <ReportantesMetricas datos={metricas.reportantes} />
      </main>
    </div>
  );
}

function MetricasEsqueleto() {
  return (
    <div className="flex min-h-dvh flex-col" aria-busy="true">
      <header className="bg-shell">
        <div className="flex h-14 items-center px-4 sm:px-6">
          <Marca />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
        <p className="sr-only">Cargando las métricas…</p>
        <div className="coupon h-28 animate-pulse" />
        <div className="coupon h-64 animate-pulse" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="coupon h-64 animate-pulse" />
          <div className="coupon h-64 animate-pulse" />
        </div>
      </main>
    </div>
  );
}
