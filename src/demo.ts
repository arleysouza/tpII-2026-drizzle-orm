import { closeConnection } from "./db";
import { create, getAll, update, remove } from "./repository";

async function main(): Promise<void> {
  console.log("Executando CRUD na tabela users.");

  const usuarioCriado = await create("Ana", "ana@example.com");
  console.log(
    `\nUsuário criado -> id: ${usuarioCriado.id}, nome: ${usuarioCriado.nome}, email: ${usuarioCriado.email}`,
  );

  console.log("\nUsuários após CREATE:");
  console.table(await getAll());

  const usuarioAtualizado = await update(usuarioCriado.id, "Ana Maria");
  console.log(
    `\nUsuário atualizado -> id: ${usuarioAtualizado.id}, nome: ${usuarioAtualizado.nome}, email: ${usuarioAtualizado.email}`,
  );

  console.log("\nUsuários após UPDATE:");
  console.table(await getAll());

  const usuarioRemovido = await remove(usuarioCriado.id);
  console.log(
    `\nUsuário removido -> id: ${usuarioRemovido.id}, nome: ${usuarioRemovido.nome}, email: ${usuarioRemovido.email}`,
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
