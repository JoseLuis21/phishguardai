/**
 * Activates an account created from /registro, after confirming the person
 * owns that email.
 *
 *   pnpm usuarios:activar persona@coplex.cl
 */
import mysql from "mysql2/promise";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Falta ${name} en .env.local`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const email = (process.argv[2] ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Uso: pnpm usuarios:activar correo@dominio");
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: requireEnv("MYSQL_HOST"),
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: requireEnv("MYSQL_DATABASE"),
    user: requireEnv("MYSQL_USER"),
    password: requireEnv("MYSQL_PASSWORD"),
  });

  try {
    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "UPDATE usuarios SET activo = 1 WHERE email = ?",
      [email],
    );
    console.log(
      result.affectedRows > 0
        ? `Activada: ${email}`
        : `No existe una cuenta con ${email}`,
    );
  } finally {
    await connection.end();
  }
}

main().catch((error: unknown) => {
  console.error(
    "No se pudo activar la cuenta:",
    error instanceof Error ? error.message : "error desconocido",
  );
  process.exit(1);
});
