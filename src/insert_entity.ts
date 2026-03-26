import { fecharConexao } from "./db";
import { usuarioRepository } from "./repositories/usuario.repository";

async function main(): Promise<void> {
  const nomes = process.argv.slice(2);

  if (nomes.length === 0) {
    throw new Error('Uso: npm run user:insert -- "Ana" "Bruno"');
  }

  for (const nome of nomes) {
    const usuario = await usuarioRepository.criar(nome);
    console.log(`Usuario inserido -> id: ${usuario.id}, nome: ${usuario.nome}`);
  }
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao inserir usuario:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await fecharConexao();
  });
