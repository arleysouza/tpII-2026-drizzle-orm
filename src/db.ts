import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./config/env";
import * as schema from "./db/schema";

const pool = new Pool({
  host: env.host,
  user: env.user,
  password: env.password,
  database: env.database,
  port: env.port,
});

export const db = drizzle(pool, { schema });

export async function fecharConexao(): Promise<void> {
  await pool.end();
}
