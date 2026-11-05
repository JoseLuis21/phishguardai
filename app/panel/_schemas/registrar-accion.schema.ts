import { z } from "zod";

import { TIPOS_ACCION } from "@/app/_interfaces/analisis";

export const registrarAccionSchema = z.object({
  correoId: z.string().regex(/^\d{1,18}$/, "Análisis inválido"),
  tipo: z.enum(TIPOS_ACCION),
  detalle: z
    .string()
    .trim()
    .max(1000, "La nota no puede superar los 1000 caracteres")
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type RegistrarAccionInput = z.infer<typeof registrarAccionSchema>;
