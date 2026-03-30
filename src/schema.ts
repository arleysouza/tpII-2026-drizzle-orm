import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const usuarios = pgTable("users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull()
});

export type Usuario = typeof usuarios.$inferSelect;

