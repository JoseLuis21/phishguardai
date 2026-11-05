import "server-only";

import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

import type { CurrentUser } from "@/app/_interfaces/user";
import { USER_ROLES } from "@/app/_interfaces/user";
import { getPool } from "./db";

const UserRowSchema = z.object({
  id: z.coerce.string(),
  email: z.string(),
  nombre: z.string().nullable(),
  password_hash: z.string(),
  rol: z.enum(USER_ROLES),
  activo: z.coerce.number(),
});

/**
 * Hash compared when the email does not exist, so a missing account costs the
 * same time as a wrong password and does not reveal which emails are registered.
 */
let timingDummyHash: string | undefined;

function getTimingDummyHash(): string {
  timingDummyHash ??= bcrypt.hashSync("timing-equalizer", 12);
  return timingDummyHash;
}

export class EmailYaRegistradoError extends Error {}

/**
 * Self-service sign-up. Always creates an inactive EMPLEADO: employee access
 * is matched by email, so nobody sees any analysis until the person proves
 * they own that email through the activation link. The analyst role is only
 * granted from the terminal script.
 */
export async function createEmployeeAccount(
  email: string,
  password: string,
): Promise<string> {
  const hash = await bcrypt.hash(password, 12);

  try {
    const [result] = await getPool().execute<ResultSetHeader>(
      "INSERT INTO usuarios (email, password_hash, rol, activo) VALUES (?, ?, 'EMPLEADO', 0)",
      [email.trim().toLowerCase(), hash],
    );
    return String(result.insertId);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "ER_DUP_ENTRY"
    ) {
      throw new EmailYaRegistradoError("Email already registered");
    }
    throw new Error("Failed to create account");
  }
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<CurrentUser | null> {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    "SELECT id, email, nombre, password_hash, rol, activo FROM usuarios WHERE email = ? LIMIT 1",
    [email.trim().toLowerCase()],
  );

  const parsed = rows[0] ? UserRowSchema.safeParse(rows[0]) : null;

  if (!parsed?.success) {
    await bcrypt.compare(password, getTimingDummyHash());
    return null;
  }

  const user = parsed.data;
  const matches = await bcrypt.compare(password, user.password_hash);

  if (!matches || user.activo !== 1) {
    return null;
  }

  await getPool().execute(
    "UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?",
    [user.id],
  );

  return {
    id: user.id,
    email: user.email,
    name: user.nombre,
    role: user.rol,
  };
}
