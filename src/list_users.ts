import { fecharConexao } from "./db";
import { usuarioRepository } from "./repositories/usuario.repository";

async function main(): Promise<void> {
  const usuarios = await usuarioRepository.listar();

  if (usuarios.length === 0) {
    console.log("Nenhum usuario cadastrado.");
    return;
  }

  console.table(usuarios);
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao listar usuarios:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await fecharConexao();
  });
