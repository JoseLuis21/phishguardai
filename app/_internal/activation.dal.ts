import "server-only";

import { createHash, randomBytes } from "node:crypto";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

import { getAppUrl } from "./app-url";
import { getPool } from "./db";
import { sendMail } from "./mailer";

const TOKEN_TTL_HOURS = 24;
/** Minimum gap between two activation emails for the same account. */
const RESEND_COOLDOWN_MINUTES = 2;

export type ActivationTokenStatus = "valido" | "invalido" | "expirado" | "usado";
export type ActivationResult = "activada" | Exclude<ActivationTokenStatus, "valido">;
export type ResendResult = "enviado" | "activa" | "espera" | "inexistente";

const TokenRowSchema = z.object({
  id: z.coerce.string(),
  usuario_id: z.coerce.string(),
  vigente: z.coerce.number(),
  usado: z.date().nullable(),
});

const PendingUserRowSchema = z.object({
  id: z.coerce.string(),
  activo: z.coerce.number(),
  reciente: z.coerce.number(),
});

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function activationEmail(link: string) {
  return {
    subject: "Activa tu cuenta de PhishGuardAI",
    text: [
      "Recibimos una solicitud para crear una cuenta en PhishGuardAI con este correo.",
      "",
      "Para activarla, abre este enlace y confirma:",
      link,
      "",
      `El enlace vence en ${TOKEN_TTL_HOURS} horas y sirve una sola vez.`,
      "Si no fuiste tú, ignora este mensaje: la cuenta quedará inactiva.",
    ].join("\n"),
    html: `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#e8eaef;font-family:Archivo,ui-sans-serif,system-ui,sans-serif;color:#1c2033">
    <div style="max-width:520px;margin:0 auto;background:#fbfaf6;border:1px solid #c9ced8;padding:28px">
      <h1 style="margin:0 0 12px;font-size:20px">Activa tu cuenta</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Recibimos una solicitud para crear una cuenta en PhishGuardAI con este correo.
        Para activarla, abre el enlace y confirma.
      </p>
      <p style="margin:0 0 20px">
        <a href="${link}" style="display:inline-block;background:#1b2a52;color:#fbfaf6;text-decoration:none;font-weight:bold;padding:12px 20px">Activar cuenta</a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#4f566a">
        Si el botón no funciona, copia esta dirección en el navegador:<br>
        <span style="word-break:break-all">${link}</span>
      </p>
      <p style="margin:0;font-size:13px;line-height:1.5;color:#4f566a">
        El enlace vence en ${TOKEN_TTL_HOURS} horas y sirve una sola vez.
        Si no fuiste tú, ignora este mensaje.
      </p>
    </div>
  </body>
</html>`,
  };
}

/**
 * Issues a fresh one-time token (older unused ones stop working) and emails
 * the link. If the email cannot be sent the token is removed, so a retry is not
 * blocked by the resend cooldown.
 */
export async function sendActivationLink(
  userId: string,
  email: string,
): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const pool = getPool();

  await pool.execute(
    "DELETE FROM tokens_activacion WHERE usuario_id = ? AND usado IS NULL",
    [userId],
  );
  const [insert] = await pool.execute<ResultSetHeader>(
    `INSERT INTO tokens_activacion (usuario_id, token_hash, expira)
     VALUES (?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${TOKEN_TTL_HOURS} HOUR))`,
    [userId, hashToken(token)],
  );

  const link = `${getAppUrl()}/activar?token=${token}`;

  try {
    await sendMail({ to: email, ...activationEmail(link) });
  } catch (error) {
    await pool.execute("DELETE FROM tokens_activacion WHERE id = ?", [
      insert.insertId,
    ]);
    throw error;
  }
}

/** Re-sends the link to an account that registered but never activated. */
export async function resendActivationLink(email: string): Promise<ResendResult> {
  const normalized = email.trim().toLowerCase();
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT u.id, u.activo,
            EXISTS (
              SELECT 1 FROM tokens_activacion t
              WHERE t.usuario_id = u.id
                AND t.fecha_creacion > DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ${RESEND_COOLDOWN_MINUTES} MINUTE)
            ) AS reciente
     FROM usuarios u WHERE u.email = ? LIMIT 1`,
    [normalized],
  );

  const parsed = rows[0] ? PendingUserRowSchema.safeParse(rows[0]) : null;

  if (!parsed?.success) {
    return "inexistente";
  }

  if (parsed.data.activo === 1) {
    return "activa";
  }

  if (parsed.data.reciente === 1) {
    return "espera";
  }

  await sendActivationLink(parsed.data.id, normalized);
  return "enviado";
}

async function findToken(token: string) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT id, usuario_id, usado, expira > CURRENT_TIMESTAMP AS vigente
     FROM tokens_activacion WHERE token_hash = ? LIMIT 1`,
    [hashToken(token)],
  );

  const parsed = rows[0] ? TokenRowSchema.safeParse(rows[0]) : null;
  return parsed?.success ? parsed.data : null;
}

function statusOf(row: z.infer<typeof TokenRowSchema> | null): ActivationTokenStatus {
  if (!row) return "invalido";
  if (row.usado) return "usado";
  if (row.vigente !== 1) return "expirado";
  return "valido";
}

/** Read-only check used to render the confirmation page. */
export async function getActivationTokenStatus(
  token: string,
): Promise<ActivationTokenStatus> {
  return statusOf(await findToken(token));
}

/**
 * Consumes the token and activates the account. The conditional UPDATE makes
 * two concurrent requests with the same token activate at most once.
 */
export async function activateAccount(token: string): Promise<ActivationResult> {
  const row = await findToken(token);
  const status = statusOf(row);

  if (status !== "valido" || !row) {
    return status as ActivationResult;
  }

  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();

    const [consumed] = await connection.execute<ResultSetHeader>(
      `UPDATE tokens_activacion SET usado = CURRENT_TIMESTAMP
       WHERE id = ? AND usado IS NULL AND expira > CURRENT_TIMESTAMP`,
      [row.id],
    );

    if (consumed.affectedRows !== 1) {
      await connection.rollback();
      return "usado";
    }

    await connection.execute("UPDATE usuarios SET activo = 1 WHERE id = ?", [
      row.usuario_id,
    ]);
    await connection.commit();
    return "activada";
  } catch {
    await connection.rollback();
    throw new Error("Failed to activate account");
  } finally {
    connection.release();
  }
}
