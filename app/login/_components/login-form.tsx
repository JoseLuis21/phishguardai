"use client";

import { useActionState, useId } from "react";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { loginAction } from "../_actions/login.action";

export function LoginForm() {
  const [estado, formAction, pendiente] = useActionState(loginAction, {
    mensaje: null,
    email: "",
  });
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor={emailId}>Correo corporativo</Label>
        <Input
          id={emailId}
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          defaultValue={estado.email}
          aria-invalid={estado.mensaje ? true : undefined}
          aria-describedby={estado.mensaje ? errorId : undefined}
          placeholder="nombre@coplex.cl"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={passwordId}>Contraseña</Label>
        <Input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={estado.mensaje ? true : undefined}
          aria-describedby={estado.mensaje ? errorId : undefined}
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
        {pendiente ? "Verificando…" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
