import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { CopiarCorreo } from "@/app/_components/copiar-correo";
import { Marca } from "@/app/_components/marca";
import { ToggleTema } from "@/app/_components/toggle-tema";
import { RutasFondo } from "@/app/_components/rutas-fondo";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
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
          <section aria-labelledby="login-titulo" className="p-6 sm:p-9">
            <h1
              id="login-titulo"
              className="text-[1.6rem] leading-tight font-bold tracking-[-0.01em] text-ink"
            >
              Iniciar sesión
            </h1>
            <p className="mt-2 max-w-[42ch] text-[0.95rem] leading-relaxed text-mute">
              Los analistas ven el talonario completo. Si reportaste un correo,
              aquí encuentras la copia de su informe.
            </p>
            <div className="mt-7">
              <LoginForm />
            </div>
            <p className="mt-6 text-[0.9rem] text-mute">
              ¿Reportaste un correo y no tienes cuenta?{" "}
              <Link href="/registro" className="font-semibold text-navy underline">
                Crear cuenta
              </Link>
            </p>
          </section>

          <div className="perforation-y hidden md:block" aria-hidden />
          <div className="perforation-x mx-6 md:hidden" aria-hidden />

          <aside className="flex flex-col gap-3 p-6 sm:p-9 md:px-7">
            <h2 className="tab-caps text-[0.72rem] text-navy">
              ¿Correo dudoso?
            </h2>
            <p className="text-[0.92rem] leading-relaxed text-ink">
              No hagas clic en sus enlaces ni abras adjuntos. Reenvíalo a:
            </p>
            <CopiarCorreo />
            <p className="text-[0.85rem] leading-relaxed text-mute">
              Recibirás el informe por correo en unos minutos.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
