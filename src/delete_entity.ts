import { fecharConexao } from "./db";
import { usuarioRepository } from "./repositories/usuario.repository";

async function main(): Promise<void> {
  const [idTexto] = process.argv.slice(2);

  if (!idTexto) {
    throw new Error("Uso: npm run user:delete -- 1");
  }

  const id = Number(idTexto);

  if (Number.isNaN(id)) {
    throw new Error("O id precisa ser um numero valido.");
  }

  const usuario = await usuarioRepository.remover(id);

  console.log(`Usuario removido -> id: ${usuario.id}, nome: ${usuario.nome}`);
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao remover usuario:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await fecharConexao();
  });
