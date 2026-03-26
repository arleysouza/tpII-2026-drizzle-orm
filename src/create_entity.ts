import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, fecharConexao } from "./db";

async function main(): Promise<void> {
  console.log("Aplicando migracoes do Drizzle...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Tabela users pronta para uso.");
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao aplicar migracoes:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await fecharConexao();
  });
