import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import type { ReactNode } from "react";

import { CopiarCorreo } from "@/app/_components/copiar-correo";
import { Marca } from "@/app/_components/marca";
import { RutasFondo } from "@/app/_components/rutas-fondo";
import { Sello } from "@/app/_components/sello";
import { ToggleTema } from "@/app/_components/toggle-tema";
import { cn } from "@/app/_utils/cn";
import { CuponEjemplo } from "./_components/cupon-ejemplo";
import { RecorridoPasos } from "./_components/recorrido-pasos";

export const metadata: Metadata = {
  title: { absolute: "PhishGuardAI · ¿Correo dudoso? Reenvíalo" },
  description:
    "Reenvía cualquier correo sospechoso a analisis.phishing@coplex.cl y recibe un informe con el veredicto, el riesgo y qué hacer.",
};

const NAV = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#veredictos", label: "Qué recibes" },
  { href: "#preguntas", label: "Preguntas" },
];

function Cabecera() {
  return (
    <header className="sticky top-0 z-20 bg-shell text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Marca href="/" />
        <nav aria-label="Secciones" className="hidden self-stretch md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="tab-caps flex items-center px-3 text-[0.74rem] text-navy-ink transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ToggleTema />
          <Link
            href="/login"
            className="tab-caps hidden px-2 text-[0.74rem] text-white hover:underline sm:block"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="tab-caps flex h-9 items-center border-2 border-shell-border px-3 text-[0.72rem] text-white transition-colors hover:border-white"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  );
}

function Seccion({
  id,
  titulo,
  bajada,
  children,
  className,
}: {
  id?: string;
  titulo: string;
  bajada?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-titulo` : undefined}
      className={cn("scroll-mt-20 py-20 sm:py-28", className)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id={id ? `${id}-titulo` : undefined}
          className="max-w-[22ch] text-[2rem] leading-[1.1] font-bold tracking-[-0.015em] text-balance text-ink sm:text-[2.6rem]"
        >
          {titulo}
        </h2>
        {bajada && (
          <p className="mt-4 max-w-[58ch] text-[1.05rem] leading-[1.6] text-mute">{bajada}</p>
        )}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

const VEREDICTOS = [
  {
    tono: "peligro" as const,
    sello: "Phishing",
    texto:
      "Es un intento de engaño. No abras sus enlaces ni adjuntos y sigue lo que dice el informe.",
  },
  {
    tono: "alerta" as const,
    sello: "Sospechoso",
    texto:
      "Tiene señales de riesgo, pero no alcanzan para afirmarlo. Trátalo con cuidado y confírmalo por otro canal.",
  },
  {
    tono: "seguro" as const,
    sello: "Probablemente legítimo",
    texto:
      "No se encontraron señales de engaño. Igual desconfía si te pide datos, pagos o contraseñas.",
  },
  {
    tono: "neutro" as const,
    sello: "No concluyente",
    texto:
      "No hubo información suficiente para decidir. Es una respuesta honesta, no un error.",
  },
];

const CAPACIDADES = [
  {
    titulo: "Cabecera",
    texto: "Quién dice enviarlo y desde dónde llegó de verdad, incluida la autenticación del remitente.",
  },
  {
    titulo: "Enlaces",
    texto: "A dónde llevan realmente, aunque el texto visible diga otra cosa.",
  },
  {
    titulo: "Adjuntos",
    texto: "Qué tipo de archivo traen y si se ven como algo que no son.",
  },
  {
    titulo: "Dominios",
    texto: "Si el dominio corresponde a quien dice ser o imita a una marca conocida.",
  },
  {
    titulo: "Patrones del mensaje",
    texto: "Urgencia, amenazas o pedidos de datos y contraseñas: las presiones típicas del engaño.",
  },
];

const PREGUNTAS = [
  {
    p: "¿Necesito una cuenta para reportar?",
    r: "No. Basta con reenviar el correo: el informe te llega por correo. La cuenta sirve para revisar tus reportes en la web.",
  },
  {
    p: "¿Desde qué correo tengo que reenviarlo?",
    r: "Desde el mismo con el que creaste tu cuenta. El informe se asocia a quien lo reenvía; si usas otra casilla, no aparecerá en tu cuenta.",
  },
  {
    p: "¿Quién ve lo que reporto?",
    r: "Tú y el equipo de seguridad. Desde tu cuenta solo ves los correos que tú reportaste.",
  },
  {
    p: "¿Y si al final era un correo legítimo?",
    r: "No pasa nada. Es mejor reportar de más: el informe te dirá que es probablemente legítimo.",
  },
  {
    p: "¿Cuánto tarda el informe?",
    r: "En poco tiempo. Llega al mismo correo desde el que reenviaste.",
  },
];

export default function InicioPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Cabecera />

      <main className="flex-1">
        {/* First viewport: the gesture, the address, the proof. */}
        <section aria-labelledby="inicio-titulo" className="relative isolate overflow-hidden">
          {/* On phones the routes start below the address field, around the coupon. */}
          <RutasFondo className="max-sm:top-[34rem]" />
          <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
            <h1
              id="inicio-titulo"
              className="max-w-[16ch] text-[2.7rem] leading-[1.02] font-bold tracking-[-0.025em] text-balance text-ink sm:text-[4.2rem] lg:text-[4.9rem]"
            >
              ¿Te llegó un correo dudoso? Reenvíalo.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[1.1rem] leading-[1.6] text-mute sm:text-[1.2rem]">
              PhishGuardAI lo analiza con IA y te responde con un informe: si es
              phishing, qué tan riesgoso es y qué hacer. Sin instalar nada.
            </p>
            <div className="mt-9 flex max-w-xl flex-col gap-4">
              <CopiarCorreo grande />
              <Link
                href="/registro"
                className="group inline-flex items-center gap-2 self-start text-[0.95rem] font-semibold text-navy"
              >
                Crea tu cuenta para ver tus informes
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <div className="mt-16 sm:mt-20">
              <CuponEjemplo />
            </div>
          </div>
        </section>

        <Seccion
          id="como-funciona"
          titulo="Del reenvío al informe. Así viaja tu reporte."
          bajada="No tienes que saber de ciberseguridad. Tu parte termina al reenviar; el resto queda registrado paso a paso."
        >
          <RecorridoPasos />
        </Seccion>

        <Seccion
          id="veredictos"
          titulo="Un veredicto claro, con su riesgo de 0 a 100."
          bajada="El informe dice qué es antes de mostrar el detalle técnico. Y no esconde la duda: «Sospechoso» y «No concluyente» son respuestas válidas."
          className="border-t border-hairline"
        >
          <ul className="coupon px-5 sm:px-8">
            {VEREDICTOS.map((v) => (
              <li
                key={v.sello}
                className="grid gap-3 border-b border-hairline py-6 last:border-b-0 sm:grid-cols-[17rem_minmax(0,1fr)] sm:items-center sm:gap-8"
              >
                <div>
                  <Sello tono={v.tono} className="border-[3px] text-[1.05rem] sm:text-[1.2rem]">
                    {v.sello}
                  </Sello>
                </div>
                <p className="max-w-[60ch] text-[1rem] leading-[1.6] text-ink">{v.texto}</p>
              </li>
            ))}
          </ul>
        </Seccion>

        <Seccion
          titulo="Dos lectores, una sola verdad."
          bajada="Tú y el equipo de seguridad ven el mismo análisis. Cambia el lenguaje, no el resultado."
        >
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <article className="coupon-copy flex flex-col gap-4 p-6 sm:p-8">
              <h3 className="text-[1.25rem] leading-snug font-bold text-ink">
                Tu copia al carbón: lenguaje simple, qué es y qué hacer.
              </h3>
              <p className="text-[0.98rem] leading-[1.6] text-mute">
                Recibes el informe por correo y, con tu cuenta, ves en la web la
                copia de cada reporte tuyo: veredicto, riesgo, señales y
                recomendaciones.
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2 text-[0.7rem]">
                <Sello tono="peligro">Phishing</Sello>
                <Sello tono="tinta">Informe enviado</Sello>
              </div>
            </article>
            <article className="coupon flex flex-col gap-4 p-6 sm:p-8">
              <h3 className="text-[1.25rem] leading-snug font-bold text-ink">
                El original de seguridad: evidencia y acciones con registro.
              </h3>
              <p className="text-[0.98rem] leading-[1.6] text-mute">
                El equipo de seguridad trabaja el talonario completo: indicadores,
                marcos de referencia como MITRE ATT&amp;CK y NIST, y cada acción
                (bloquear un dominio, buscar en el tenant) timbrada en la bitácora.
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2 text-[0.7rem]">
                <Sello tono="tinta">Dominio bloqueado</Sello>
                <Sello tono="tinta">Búsqueda en el tenant</Sello>
                <Sello tono="neutro" linea="discontinua">Informe pendiente</Sello>
              </div>
            </article>
          </div>
        </Seccion>

        <Seccion
          titulo="Qué revisa el analizador en cada correo."
          bajada="Cinco frentes, revisados sin que tengas que abrir nada. Cada señal encontrada aparece en el informe, también las que apuntan a que es legítimo."
          className="border-t border-hairline"
        >
          <dl className="coupon grid sm:grid-cols-2 lg:grid-cols-3">
            {CAPACIDADES.map((item) => (
              <div
                key={item.titulo}
                className="flex flex-col gap-1.5 border-hairline p-6 max-lg:border-b sm:max-lg:odd:border-r lg:border-r lg:border-b lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
              >
                <dt className="tab-caps text-[0.78rem] text-navy">{item.titulo}</dt>
                <dd className="text-[0.95rem] leading-[1.55] text-mute">{item.texto}</dd>
              </div>
            ))}
            <div className="flex flex-col justify-center gap-1.5 p-6">
              <dt className="carbon text-[2.1rem] leading-none font-bold [font-stretch:75%]">
                0–100
              </dt>
              <dd className="text-[0.95rem] leading-[1.55] text-mute">
                Con todo eso calcula un riesgo y elige uno de los cuatro veredictos.
              </dd>
            </div>
          </dl>
        </Seccion>

        <Seccion
          id="preguntas"
          titulo="Preguntas frecuentes"
          className="border-t border-hairline"
        >
          <div className="max-w-3xl border-t border-hairline">
            {PREGUNTAS.map((item) => (
              <details key={item.p} className="group border-b border-hairline">
                <summary className="flex list-none items-center justify-between gap-6 py-5 text-[1.08rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {item.p}
                  <Plus
                    aria-hidden
                    className="size-5 shrink-0 text-navy transition-transform duration-200 group-open:rotate-45"
                    strokeWidth={2}
                  />
                </summary>
                <p className="max-w-[62ch] pb-6 text-[1rem] leading-[1.6] text-mute">{item.r}</p>
              </details>
            ))}
          </div>
        </Seccion>

        {/* Closing coupon: the same action, now with the three don'ts. */}
        <section aria-labelledby="cierre-titulo" className="pb-24 sm:pb-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="coupon grid md:grid-cols-[minmax(0,1fr)_2px_minmax(0,22rem)]">
              <div className="p-6 sm:p-10">
                <h2
                  id="cierre-titulo"
                  className="max-w-[18ch] text-[2rem] leading-[1.1] font-bold tracking-[-0.015em] text-balance text-ink sm:text-[2.4rem]"
                >
                  ¿Tienes uno ahora? Reenvíalo antes de tocar nada.
                </h2>
                <CopiarCorreo grande className="mt-8 max-w-xl" />
              </div>
              <div className="perforation-y perforation-notch hidden md:block" aria-hidden />
              <div className="perforation-x mx-6 md:hidden" aria-hidden />
              <div className="flex flex-col gap-4 p-6 sm:p-10 md:px-8">
                <h3 className="tab-caps text-[0.72rem] text-navy">Mientras tanto</h3>
                <ul className="flex flex-col gap-3 text-[0.98rem] leading-snug text-ink">
                  <li>No hagas clic en sus enlaces.</li>
                  <li>No abras sus adjuntos.</li>
                  <li>No respondas ni lo reenvíes a otras personas.</li>
                </ul>
                <Link
                  href="/registro"
                  className="group mt-auto inline-flex items-center gap-2 pt-2 text-[0.92rem] font-semibold text-navy"
                >
                  Crear cuenta
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-shell text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <Marca href="/" />
            <p className="text-[0.85rem] text-navy-ink">Análisis con IA de correos sospechosos.</p>
          </div>
          <div className="flex max-w-[52ch] flex-col gap-1.5 text-[0.78rem] leading-relaxed text-navy-ink md:text-right">
            <p>
              Proyecto del Grupo 3 · Diplomado de Gestión Técnica de Ciberseguridad ·
              Pontificia Universidad Católica de Chile.
            </p>
            <p>Las pantallas de esta página son ejemplos ilustrativos con datos inventados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
