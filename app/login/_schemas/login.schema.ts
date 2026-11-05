import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Escribe un correo válido."),
  password: z
    .string()
    .min(1, "Escribe tu contraseña.")
    .max(200, "La contraseña es demasiado larga."),
});

export type LoginInput = z.infer<typeof loginSchema>;
