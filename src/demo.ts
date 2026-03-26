import { fecharConexao } from "./db";
import { usuarioRepository } from "./repositories/usuario.repository";

async function main(): Promise<void> {
  const nomes = ["Ana", "Bruno", "Carla"];

  console.log("Inserindo usuarios de exemplo...");

  for (const nome of nomes) {
    const usuario = await usuarioRepository.criar(nome);
    console.log(`Usuario criado -> id: ${usuario.id}, nome: ${usuario.nome}`);
  }

  console.log("\nUsuarios persistidos no banco:");
  console.table(await usuarioRepository.listar());
}

main()
  .catch((error: unknown) => {
    console.error("Erro na demonstracao:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await fecharConexao();
  });
