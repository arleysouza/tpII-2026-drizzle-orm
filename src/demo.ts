import { fecharConexao } from "./db";
import { usuarioRepository } from "./repositories/usuario.repository";

async function main(): Promise<void> {
  const nomes = ["Ana", "Bruno", "Carla"];
  const usuariosCriados = [];

  console.log("Inserindo usuarios de exemplo...");

  for (const nome of nomes) {
    const usuario = await usuarioRepository.criar(nome);
    usuariosCriados.push(usuario);
    console.log(`Usuario criado -> id: ${usuario.id}, nome: ${usuario.nome}`);
  }

  if (usuariosCriados.length >= 2) {
    const primeiroUsuario = usuariosCriados[0];
    const segundoUsuario = usuariosCriados[1];

    await usuarioRepository.alterar(primeiroUsuario.id, "Ana Atualizada");
    console.log(`\nUsuario atualizado -> id: ${primeiroUsuario.id}, nome: Ana Atualizada`);

    const usuarioRemovido = await usuarioRepository.remover(segundoUsuario.id);
    console.log(`Usuario removido -> id: ${usuarioRemovido.id}, nome: ${usuarioRemovido.nome}`);
  }

  console.log("\nUsuarios persistidos no banco apos INSERT, UPDATE e DELETE:");
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
