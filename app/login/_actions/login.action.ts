"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { loginSchema } from "../_schemas/login.schema";

export async function loginAction(
  _prev: { mensaje: string | null; email: string },
  formData: FormData,
): Promise<{ mensaje: string | null; email: string }> {
  const email = String(formData.get("email") ?? "");
  const parsed = loginSchema.safeParse({
    email,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      mensaje: parsed.error.issues[0]?.message ?? "Revisa los datos.",
      email,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/panel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        mensaje:
          error.type === "CredentialsSignin"
            ? "El correo o la contraseña no coinciden, o la cuenta aún no está activada."
            : "No pudimos iniciar sesión. Inténtalo de nuevo.",
        email,
      };
    }
    // signIn redirects by throwing; let Next.js handle it.
    throw error;
  }

  return { mensaje: null, email };
}
