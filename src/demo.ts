import { closeConnection, ensureUsersTable } from "./db";
import { create, getAll, update, remove } from "./repository";

async function main(): Promise<void> {
  await ensureUsersTable();
  console.log("Tabela users pronta.");

  const usuarioCriado = await create("Ana");
  console.log(
    `\nUsuário criado -> id: ${usuarioCriado.id}, nome: ${usuarioCriado.nome}`,
  );

  console.log("\nUsuários após CREATE:");
  console.table(await getAll());

  const usuarioAtualizado = await update(usuarioCriado.id, "Ana Maria");
  console.log(
    `\nUsuário atualizado -> id: ${usuarioAtualizado.id}, nome: ${usuarioAtualizado.nome}`,
  );

  console.log("\nUsuários após UPDATE:");
  console.table(await getAll());

  const usuarioRemovido = await remove(usuarioCriado.id);
  console.log(
    `\nUsuário removido -> id: ${usuarioRemovido.id}, nome: ${usuarioRemovido.nome}`,
  );

  console.log("\nUsuários após DELETE:");
  console.table(await getAll());
}

main()
  .catch((error: unknown) => {
    console.error("Erro na demonstração:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeConnection();
  });
