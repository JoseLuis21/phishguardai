"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/app/_components/ui/button";
import { activarAction } from "../_actions/activar.action";
import { EstadoEnlace } from "./estado-enlace";

export function ActivarForm({ token }: { token: string }) {
  const [estado, formAction, pendiente] = useActionState(activarAction, {
    resultado: null,
  });

  if (estado.resultado === "activada") {
    return (
      <div role="status" className="flex flex-col gap-4">
        <p className="text-[1.05rem] font-semibold text-ink">Cuenta activada</p>
        <p className="max-w-[46ch] text-[0.92rem] leading-relaxed text-mute">
          Ya puedes iniciar sesión con tu correo y la contraseña que elegiste.
        </p>
        <Link href="/login" className="text-[0.92rem] font-semibold text-navy underline">
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  if (estado.resultado && estado.resultado !== "error") {
    return <EstadoEnlace estado={estado.resultado} />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <p className="max-w-[46ch] text-[0.92rem] leading-relaxed text-mute">
        Confirma para activar la cuenta. Después podrás iniciar sesión y ver la
        copia de cada informe que reportes.
      </p>
      <p
        role="alert"
        className="text-[0.88rem] font-semibold text-jet-red empty:hidden"
      >
        {estado.resultado === "error"
          ? "No pudimos activar la cuenta. Inténtalo de nuevo."
          : ""}
      </p>
      <Button type="submit" size="lg" disabled={pendiente} className="w-full">
        {pendiente ? "Activando…" : "Activar cuenta"}
      </Button>
    </form>
  );
}
