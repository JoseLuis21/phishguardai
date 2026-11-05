"use server";

import {
  resendActivationLink,
  sendActivationLink,
} from "@/app/_internal/activation.dal";
import {
  EmailYaRegistradoError,
  createEmployeeAccount,
} from "@/app/_internal/users.dal";
import { registroSchema } from "../_schemas/registro.schema";

export type RegistroResultado =
  | "enviado"
  | "reenviado"
  | "espera"
  | "correo_fallido";

export type RegistroEstado = {
  resultado: RegistroResultado | null;
  mensaje: string | null;
  email: string;
};

const CUENTA_ACTIVA = "Ese correo ya tiene una cuenta. Inicia sesión.";
const ERROR_GENERICO = "No pudimos crear la cuenta. Inténtalo de nuevo.";

export async function registroAction(
  _prev: RegistroEstado,
  formData: FormData,
): Promise<RegistroEstado> {
  const email = String(formData.get("email") ?? "");
  const parsed = registroSchema.safeParse({
    email,
    password: formData.get("password"),
    confirmacion: formData.get("confirmacion"),
  });

  if (!parsed.success) {
    return {
      resultado: null,
      mensaje: parsed.error.issues[0]?.message ?? "Revisa los datos.",
      email,
    };
  }

  const correo = parsed.data.email;
  let usuarioId: string;

  try {
    usuarioId = await createEmployeeAccount(correo, parsed.data.password);
  } catch (error) {
    if (!(error instanceof EmailYaRegistradoError)) {
      return { resultado: null, mensaje: ERROR_GENERICO, email };
    }
    return reenviar(correo);
  }

  try {
    await sendActivationLink(usuarioId, correo);
  } catch {
    return { resultado: "correo_fallido", mensaje: null, email: correo };
  }

  return { resultado: "enviado", mensaje: null, email: correo };
}

/** The email already has an account: re-send the link if it is still pending. */
async function reenviar(correo: string): Promise<RegistroEstado> {
  try {
    const resultado = await resendActivationLink(correo);

    switch (resultado) {
      case "enviado":
        return { resultado: "reenviado", mensaje: null, email: correo };
      case "espera":
        return { resultado: "espera", mensaje: null, email: correo };
      case "activa":
        return { resultado: null, mensaje: CUENTA_ACTIVA, email: correo };
      default:
        return { resultado: null, mensaje: ERROR_GENERICO, email: correo };
    }
  } catch {
    return { resultado: "correo_fallido", mensaje: null, email: correo };
  }
}
