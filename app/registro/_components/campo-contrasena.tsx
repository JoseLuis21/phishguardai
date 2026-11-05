"use client";

import { Check, Eye, EyeOff, X } from "lucide-react";
import { useId, useState } from "react";

import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { cn } from "@/app/_utils/cn";
import { PASSWORD_MIN, REGLAS_CONTRASENA } from "../_schemas/registro.schema";

const NIVELES = [
  { etiqueta: "Muy débil", color: "bg-jet-red" },
  { etiqueta: "Débil", color: "bg-jet-red" },
  { etiqueta: "Media", color: "bg-amber" },
  { etiqueta: "Buena", color: "bg-amber" },
  { etiqueta: "Fuerte", color: "bg-green" },
] as const;

/**
 * New-password field with a 4-segment meter and a live checklist. The meter's
 * colour is never alone: the level is also written out, and every rule says
 * met or missing in words for screen readers.
 */
export function CampoContrasena({
  invalido,
  describedBy,
}: {
  invalido: boolean;
  describedBy?: string;
}) {
  const [valor, setValor] = useState("");
  const [visible, setVisible] = useState(false);
  const id = useId();
  const reglasId = useId();

  const cumplidas = REGLAS_CONTRASENA.filter((regla) => regla.cumple(valor)).length;
  // 0–5 rules met → 0–4 lit segments; nothing lit while the field is empty.
  const segmentos = valor ? Math.max(1, cumplidas - 1) : 0;
  const nivel = NIVELES[Math.max(0, cumplidas - 1)];

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Contraseña</Label>
      <div className="relative">
        <Input
          id={id}
          name="password"
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          minLength={PASSWORD_MIN}
          required
          value={valor}
          onChange={(evento) => setValor(evento.target.value)}
          aria-invalid={invalido || undefined}
          aria-describedby={[reglasId, describedBy].filter(Boolean).join(" ")}
          className="pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-mute transition-colors hover:text-navy"
        >
          {visible ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div aria-hidden className="grid flex-1 grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 transition-colors duration-200",
                i < segmentos ? nivel.color : "bg-hairline",
              )}
            />
          ))}
        </div>
        <span className="tab-caps w-[5.5rem] text-right text-[0.62rem] text-mute">
          {valor ? nivel.etiqueta : ""}
        </span>
      </div>

      <ul id={reglasId} className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        {REGLAS_CONTRASENA.map((regla) => {
          const ok = regla.cumple(valor);
          return (
            <li
              key={regla.id}
              className={cn(
                "flex items-center gap-1.5 text-[0.8rem] transition-colors",
                ok ? "text-green" : "text-mute",
              )}
            >
              {ok ? (
                <Check aria-hidden className="size-3.5 shrink-0" strokeWidth={2.5} />
              ) : (
                <X aria-hidden className="size-3.5 shrink-0" strokeWidth={2.5} />
              )}
              {regla.etiqueta}
              <span className="sr-only">{ok ? ": cumplido" : ": falta"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
