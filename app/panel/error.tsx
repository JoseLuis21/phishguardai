"use client";

import { Button } from "@/app/_components/ui/button";

export default function PanelError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="coupon w-full max-w-lg px-6 py-8">
        <h1 className="text-[1.3rem] font-bold text-ink">
          No pudimos cargar el talonario
        </h1>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-mute">
          Falló la conexión con la base de análisis. Revisa tu conexión e
          inténtalo de nuevo; si persiste, avisa al equipo que administra
          PhishGuardAI.
        </p>
        <Button className="mt-6" onClick={() => retry()}>
          Reintentar
        </Button>
      </div>
    </main>
  );
}
