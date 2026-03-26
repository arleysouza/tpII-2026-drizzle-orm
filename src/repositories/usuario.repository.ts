import { asc } from "drizzle-orm";
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
}

export const usuarioRepository = new UsuarioRepository();
