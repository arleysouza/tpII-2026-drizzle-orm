import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, closeConnection } from "./db";

async function main(): Promise<void> {
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrações aplicadas com sucesso.");
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao aplicar migrações:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeConnection();
  });
