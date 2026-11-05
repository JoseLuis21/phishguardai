import { z } from "zod";

import { VISTAS_PANEL } from "@/app/_interfaces/analisis";

const firstValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value;

export const panelSearchParamsSchema = z.object({
  vista: z.preprocess(
    firstValue,
    z.enum(VISTAS_PANEL).catch("pendientes"),
  ),
  id: z.preprocess(
    firstValue,
    z
      .string()
      .regex(/^\d{1,18}$/)
      .optional()
      .catch(undefined),
  ),
});

export type PanelSearchParams = z.infer<typeof panelSearchParamsSchema>;
