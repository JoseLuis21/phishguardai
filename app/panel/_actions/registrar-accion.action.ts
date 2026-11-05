"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import {
  AccionRechazadaError,
  registrarAccion,
} from "../_internal/analisis.dal";
import { registrarAccionSchema } from "../_schemas/registrar-accion.schema";

export async function registrarAccionAction(
  _prev: { ok: boolean; mensaje: string | null },
  formData: FormData,
): Promise<{ ok: boolean; mensaje: string | null }> {
  const parsed = registrarAccionSchema.safeParse({
    correoId: formData.get("correoId"),
    tipo: formData.get("tipo"),
    detalle: formData.get("detalle") ?? undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      mensaje: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    await registrarAccion(parsed.data);
  } catch (error) {
    if (error instanceof AccionRechazadaError) {
      return { ok: false, mensaje: error.message };
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return {
        ok: false,
        mensaje: "Solo un analista puede timbrar acciones.",
      };
    }
    return {
      ok: false,
      mensaje: "No se pudo registrar la acción. Inténtalo de nuevo.",
    };
  }

  revalidatePath("/panel");

  return { ok: true, mensaje: null };
}
