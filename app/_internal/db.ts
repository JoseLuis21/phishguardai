import "server-only";

import mysql from "mysql2/promise";
import { z } from "zod";

const DatabaseEnvSchema = z.object({
  MYSQL_HOST: z.string().min(1),
  MYSQL_PORT: z.coerce.number().int().positive().default(3306),
  MYSQL_DATABASE: z.string().min(1),
  MYSQL_USER: z.string().min(1),
  MYSQL_PASSWORD: z.string().min(1),
});

declare global {
  var __phishguardPool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  const parsed = DatabaseEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error("Database configuration is incomplete");
  }

  const env = parsed.data;

  return mysql.createPool({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    database: env.MYSQL_DATABASE,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60_000,
    connectTimeout: 10_000,
    enableKeepAlive: true,
    charset: "utf8mb4",
  });
}

/**
 * Single pool per server process. In development the module is re-evaluated on
 * every HMR cycle, so the pool lives on globalThis to avoid leaking connections.
 */
export function getPool(): mysql.Pool {
  globalThis.__phishguardPool ??= createPool();
  return globalThis.__phishguardPool;
}
