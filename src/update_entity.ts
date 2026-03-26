import { fecharConexao } from "./db";
import { usuarioRepository } from "./repositories/usuario.repository";

async function main(): Promise<void> {
  const [idTexto, ...nomePartes] = process.argv.slice(2);

  if (!idTexto || nomePartes.length === 0) {
    throw new Error('Uso: npm run user:update -- 1 "Novo Nome"');
  }

  const id = Number(idTexto);

  if (Number.isNaN(id)) {
    throw new Error("O id precisa ser um numero valido.");
  }

  const nome = nomePartes.join(" ");
  const usuario = await usuarioRepository.alterar(id, nome);

  console.log(`Usuario atualizado -> id: ${usuario.id}, nome: ${usuario.nome}`);
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao atualizar usuario:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await fecharConexao();
  });
