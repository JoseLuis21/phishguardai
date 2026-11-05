"use server";

import {
  activateAccount,
  type ActivationResult,
} from "@/app/_internal/activation.dal";
import { activarFormSchema } from "../_schemas/activar.schema";

export type ActivarEstado = {
  resultado: ActivationResult | "error" | null;
};

export async function activarAction(
  _prev: ActivarEstado,
  formData: FormData,
): Promise<ActivarEstado> {
  const parsed = activarFormSchema.safeParse({ token: formData.get("token") });

  if (!parsed.success) {
    return { resultado: "invalido" };
  }

  try {
    return { resultado: await activateAccount(parsed.data.token) };
  } catch {
    return { resultado: "error" };
  }
}
