import { z } from "zod";

export const PASSWORD_MIN = 10;

/**
 * Strength rules for new accounts only. Login keeps accepting any existing
 * password, so accounts created before these rules are not affected. The
 * form's live checklist and the server validation share this list.
 */
export const REGLAS_CONTRASENA = [
  {
    id: "largo",
    etiqueta: `${PASSWORD_MIN} caracteres mínimo`,
    cumple: (valor: string) => valor.length >= PASSWORD_MIN,
  },
  {
    id: "mayuscula",
    etiqueta: "Una mayúscula",
    cumple: (valor: string) => /\p{Lu}/u.test(valor),
  },
  {
    id: "minuscula",
    etiqueta: "Una minúscula",
    cumple: (valor: string) => /\p{Ll}/u.test(valor),
  },
  {
    id: "numero",
    etiqueta: "Un número",
    cumple: (valor: string) => /\p{Nd}/u.test(valor),
  },
  {
    id: "simbolo",
    etiqueta: "Un símbolo",
    cumple: (valor: string) => /[^\p{L}\p{Nd}\s]/u.test(valor),
  },
] as const;

export const registroSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Escribe un correo válido.")
      .max(254, "El correo es demasiado largo."),
    password: z
      .string()
      .max(200, "La contraseña es demasiado larga.")
      .refine((valor) => REGLAS_CONTRASENA.every((regla) => regla.cumple(valor)), {
        message: `La contraseña necesita al menos ${PASSWORD_MIN} caracteres, una mayúscula, una minúscula, un número y un símbolo.`,
      }),
    confirmacion: z.string(),
  })
  .refine((data) => data.password === data.confirmacion, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmacion"],
  });

export type RegistroInput = z.infer<typeof registroSchema>;
