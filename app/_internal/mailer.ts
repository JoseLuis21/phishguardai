import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { z } from "zod";

const SmtpEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM: z.string().min(1).optional(),
});

declare global {
  var __phishguardMailer: { transporter: Transporter; from: string } | undefined;
}

function createMailer() {
  const parsed = SmtpEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error("SMTP configuration is incomplete");
  }

  const env = parsed.data;

  return {
    transporter: nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      // 465 is implicit TLS; any other port upgrades with STARTTLS.
      secure: env.SMTP_PORT === 465,
      requireTLS: env.SMTP_PORT !== 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    }),
    from: env.SMTP_FROM ?? `"PhishGuardAI" <${env.SMTP_USER}>`,
  };
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail(message: MailMessage): Promise<void> {
  try {
    globalThis.__phishguardMailer ??= createMailer();
    const { transporter, from } = globalThis.__phishguardMailer;
    await transporter.sendMail({ from, ...message });
  } catch (error) {
    // Only diagnostic fields: never the message body, recipients or credentials.
    const detail = error as { code?: string; responseCode?: number; command?: string };
    console.error("[mailer] send failed", {
      reason: error instanceof Error ? error.message.slice(0, 200) : "unknown",
      code: detail.code,
      responseCode: detail.responseCode,
      command: detail.command,
    });
    throw new Error("Failed to send email");
  }
}
