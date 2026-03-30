import { asc, eq } from "drizzle-orm";
import { db } from "./db";
import { usuarios, type Usuario } from "./schema";

async function create(nome: string): Promise<Usuario> {
  const [usuarioCriado] = await db
    .insert(usuarios)
    .values({ nome })
    .returning();

  if (!usuarioCriado) {
    throw new Error("Falha ao inserir usuário.");
  }

  return usuarioCriado;
}

async function getAll(): Promise<Usuario[]> {
  return db.select().from(usuarios).orderBy(asc(usuarios.id));
}

async function update(id: number, nome: string): Promise<Usuario> {
  const [usuarioAtualizado] = await db
    .update(usuarios)
    .set({ nome })
    .where(eq(usuarios.id, id))
    .returning();

  if (!usuarioAtualizado) {
    throw new Error(`Usuário com id ${id} não foi encontrado.`);
  }

  return usuarioAtualizado;
}

async function remove(id: number): Promise<Usuario> {
  const [usuarioRemovido] = await db
    .delete(usuarios)
    .where(eq(usuarios.id, id))
    .returning();

  if (!usuarioRemovido) {
    throw new Error(`Usuário com id ${id} não foi encontrado.`);
  }

  return usuarioRemovido;
}

export { create, getAll, update, remove };

