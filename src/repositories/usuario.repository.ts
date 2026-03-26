import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { usuarios, type Usuario } from "../db/schema";

export class UsuarioRepository {
  async criar(nome: string): Promise<Usuario> {
    const [usuarioCriado] = await db.insert(usuarios).values({ nome }).returning();

    if (!usuarioCriado) {
      throw new Error("Falha ao inserir usuario.");
    }

    return usuarioCriado;
  }

  async listar(): Promise<Usuario[]> {
    return db.select().from(usuarios).orderBy(asc(usuarios.id));
  }

  async alterar(id: number, nome: string): Promise<Usuario> {
    const [usuarioAtualizado] = await db
      .update(usuarios)
      .set({ nome })
      .where(eq(usuarios.id, id))
      .returning();

    if (!usuarioAtualizado) {
      throw new Error(`Usuario com id ${id} nao foi encontrado.`);
    }

    return usuarioAtualizado;
  }

  async remover(id: number): Promise<Usuario> {
    const [usuarioRemovido] = await db
      .delete(usuarios)
      .where(eq(usuarios.id, id))
      .returning();

    if (!usuarioRemovido) {
      throw new Error(`Usuario com id ${id} nao foi encontrado.`);
    }

    return usuarioRemovido;
  }
}

export const usuarioRepository = new UsuarioRepository();
