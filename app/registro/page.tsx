import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { CopiarCorreo } from "@/app/_components/copiar-correo";
import { Marca } from "@/app/_components/marca";
import { ToggleTema } from "@/app/_components/toggle-tema";
import { RutasFondo } from "@/app/_components/rutas-fondo";
import { RegistroForm } from "./_components/registro-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegistroPage() {
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
        <div className="coupon grid w-full max-w-[56rem] md:grid-cols-[minmax(0,1fr)_2px_21rem]">
          <section aria-labelledby="registro-titulo" className="p-6 sm:p-9">
            <h1
              id="registro-titulo"
              className="text-[1.6rem] leading-tight font-bold tracking-[-0.01em] text-ink"
            >
              Crear cuenta
            </h1>
            <p className="mt-2 max-w-[42ch] text-[0.95rem] leading-relaxed text-mute">
              Usa el mismo correo desde el que reenvías los correos dudosos.
              Así verás aquí la copia de cada informe.
            </p>
            <div className="mt-7">
              <RegistroForm />
            </div>
            <p className="mt-6 text-[0.9rem] text-mute">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-semibold text-navy underline">
                Inicia sesión
              </Link>
            </p>
          </section>

          <div className="perforation-y hidden md:block" aria-hidden />
          <div className="perforation-x mx-6 md:hidden" aria-hidden />

          <aside className="flex flex-col gap-3 p-6 sm:p-9 md:px-7">
            <h2 className="tab-caps text-[0.72rem] text-navy">¿Correo dudoso?</h2>
            <p className="text-[0.92rem] leading-relaxed text-ink">
              No hace falta cuenta para reportar. Reenvíalo a:
            </p>
            <CopiarCorreo />
            <p className="text-[0.85rem] leading-relaxed text-mute">
              El informe llega por correo; la cuenta sirve para revisar tus
              reportes aquí.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
