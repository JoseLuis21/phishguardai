import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

import { Marca } from "@/app/_components/marca";
import { ToggleTema } from "@/app/_components/toggle-tema";
import { RutasFondo } from "@/app/_components/rutas-fondo";
import { getActivationTokenStatus } from "@/app/_internal/activation.dal";
import { ActivarForm } from "./_components/activar-form";
import { EstadoEnlace } from "./_components/estado-enlace";
import { activarSearchParamsSchema } from "./_schemas/activar.schema";

export const metadata: Metadata = {
  title: "Activar cuenta",
  // The URL carries a one-time token.
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function ActivarPage({ searchParams }: PageProps<"/activar">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-shell">
        <div className="flex h-14 items-center px-4 sm:px-6">
          <Marca href="/" />
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              className="tab-caps flex items-center gap-1.5 px-2 text-[0.74rem] text-navy-ink transition-colors hover:text-white"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Inicio
            </Link>
            <ToggleTema />
          </div>
        </div>
      </header>

      <main className="relative isolate grid flex-1 place-items-center px-4 py-10">
        <RutasFondo />
        <section
          aria-labelledby="activar-titulo"
          className="coupon w-full max-w-lg p-6 sm:p-9"
        >
          <h1
            id="activar-titulo"
            className="text-[1.6rem] leading-tight font-bold tracking-[-0.01em] text-ink"
          >
            Activar cuenta
          </h1>
          <div className="mt-6">
            <Suspense
              fallback={
                <p className="text-[0.92rem] text-mute">Revisando el enlace…</p>
              }
            >
              <ActivarContenido searchParams={searchParams} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}

async function ActivarContenido({
  searchParams,
}: {
  searchParams: PageProps<"/activar">["searchParams"];
}) {
  // The token check reads the database: always at request time, never prerendered.
  await connection();
  const { token } = activarSearchParamsSchema.parse(await searchParams);

  if (!token) {
    return <EstadoEnlace estado="invalido" />;
  }

  const estado = await getActivationTokenStatus(token);

  if (estado !== "valido") {
    return <EstadoEnlace estado={estado} />;
  }

  return <ActivarForm token={token} />;
}
