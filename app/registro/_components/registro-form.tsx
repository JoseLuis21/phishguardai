"use client";

import Link from "next/link";
import { useActionState, useId } from "react";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  registroAction,
  type RegistroResultado,
} from "../_actions/registro.action";
import { CampoContrasena } from "./campo-contrasena";

const TEXTOS_RESULTADO: Record<
  RegistroResultado,
  { titulo: string; detalle: string }
> = {
  enviado: {
    titulo: "Revisa tu correo:",
    detalle:
      "Te enviamos un enlace para confirmar que el correo es tuyo y activar la cuenta. Vence en 24 horas. Si no lo ves, revisa la carpeta de spam.",
  },
  reenviado: {
    titulo: "Te reenviamos el enlace a",
    detalle:
      "Esa cuenta estaba pendiente de activación. Usa el enlace más reciente: los anteriores dejaron de funcionar. Tu contraseña no cambió.",
  },
  espera: {
    titulo: "Ya enviamos un enlace a",
    detalle:
      "Lo mandamos hace menos de dos minutos. Revisa tu bandeja y la carpeta de spam antes de pedir otro.",
  },
  correo_fallido: {
    titulo: "No pudimos enviar el correo a",
    detalle:
      "La cuenta quedó registrada pero sin activar. Vuelve a registrarte con el mismo correo en unos minutos para recibir el enlace.",
  },
};

export function RegistroForm() {
  const [estado, formAction, pendiente] = useActionState(registroAction, {
    resultado: null,
    mensaje: null,
    email: "",
  });
  const emailId = useId();
  const confirmacionId = useId();
  const errorId = useId();

  const describedBy = (extra?: string) =>
    [extra, estado.mensaje ? errorId : undefined].filter(Boolean).join(" ") ||
    undefined;

  if (estado.resultado) {
    const { titulo, detalle } = TEXTOS_RESULTADO[estado.resultado];

    return (
      <div role="status" className="flex flex-col gap-4">
        <p className="text-[1.05rem] font-semibold text-ink">
          {titulo} <span className="carbon break-all">{estado.email}</span>
        </p>
        <p className="max-w-[46ch] text-[0.92rem] leading-relaxed text-mute">
          {detalle}
        </p>
        <Link href="/login" className="text-[0.92rem] font-semibold text-navy underline">
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor={emailId}>Correo</Label>
        <Input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={estado.email}
          aria-invalid={estado.mensaje ? true : undefined}
          aria-describedby={describedBy()}
          placeholder="nombre@coplex.cl"
        />
      </div>
      <CampoContrasena
        invalido={Boolean(estado.mensaje)}
        describedBy={estado.mensaje ? errorId : undefined}
      />
      <div className="flex flex-col gap-2">
        <Label htmlFor={confirmacionId}>Repite la contraseña</Label>
        <Input
          id={confirmacionId}
          name="confirmacion"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={estado.mensaje ? true : undefined}
          aria-describedby={describedBy()}
        />
      </div>

      <p
        id={errorId}
        role="alert"
        className="text-[0.88rem] font-semibold text-jet-red empty:hidden"
      >
        {estado.mensaje ?? ""}
      </p>

      <Button type="submit" size="lg" disabled={pendiente} className="w-full">
        {pendiente ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
