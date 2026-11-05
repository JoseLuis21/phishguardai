/**
 * Creates or updates a PhishGuardAI user.
 *
 *   pnpm usuarios:crear
 *
 * Asks for email, name, role and password in the terminal. The password is
 * read without echo and only its bcrypt hash reaches the database.
 */
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const ROLES = ["ANALISTA", "EMPLEADO"] as const;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Falta ${name} en .env.local`);
    process.exit(1);
  }
  return value;
}

async function askHidden(question: string): Promise<string> {
  stdout.write(question);
  stdin.setRawMode?.(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  return new Promise((resolve) => {
    let value = "";
    const onData = (char: string) => {
      if (char === "\r" || char === "\n" || char === "\u0004") {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.off("data", onData);
        stdout.write("\n");
        resolve(value);
      } else if (char === "\u0003") {
        stdout.write("\n");
        process.exit(130);
      } else if (char === "\u007f") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  const email = (await rl.question("Correo: ")).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Correo inválido.");
    process.exit(1);
  }

  const nombre = (await rl.question("Nombre (opcional): ")).trim() || null;

  const rolRaw = (await rl.question("Rol [ANALISTA/EMPLEADO] (EMPLEADO): "))
    .trim()
    .toUpperCase();
  const rol = (rolRaw || "EMPLEADO") as (typeof ROLES)[number];
  if (!ROLES.includes(rol)) {
    console.error("Rol inválido.");
    process.exit(1);
  }
  rl.close();

  const password = await askHidden("Contraseña (mín. 12 caracteres): ");
  if (password.length < 12) {
    console.error("La contraseña debe tener al menos 12 caracteres.");
    process.exit(1);
  }
  const confirm = await askHidden("Repite la contraseña: ");
  if (password !== confirm) {
    console.error("Las contraseñas no coinciden.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  const connection = await mysql.createConnection({
    host: requireEnv("MYSQL_HOST"),
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: requireEnv("MYSQL_DATABASE"),
    user: requireEnv("MYSQL_USER"),
    password: requireEnv("MYSQL_PASSWORD"),
  });

  try {
    await connection.execute(
      `INSERT INTO usuarios (email, nombre, password_hash, rol)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         nombre = VALUES(nombre),
         password_hash = VALUES(password_hash),
         rol = VALUES(rol),
         activo = 1`,
      [email, nombre, hash, rol],
    );
    console.log(`Listo: ${email} (${rol}).`);
  } finally {
    await connection.end();
  }
}

main().catch((error: unknown) => {
  console.error(
    "No se pudo crear el usuario:",
    error instanceof Error ? error.message : "error desconocido",
  );
  process.exit(1);
});
