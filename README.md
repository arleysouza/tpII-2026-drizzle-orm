# Exemplo Didatico com Drizzle ORM

Projeto em TypeScript para demonstrar o uso do **Drizzle ORM** com **PostgreSQL**, sem Express e sem interface web.

O foco do exemplo e:

- definir o schema da tabela `users`
- gerar migracoes com o Drizzle Kit
- aplicar as migracoes no banco
- inserir usuarios
- listar usuarios

## Tabela usada

```ts
export const usuarios = pgTable("users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
});
```

## Estrutura

```text
src/
  config/env.ts
  db.ts
  db/schema.ts
  repositories/usuario.repository.ts
  create_entity.ts
  insert_entity.ts
  list_users.ts
  demo.ts
drizzle.config.ts
```

## Papel de cada arquivo

- `src/db/schema.ts`: define a tabela `users` com Drizzle.
- `src/db.ts`: cria a conexao com PostgreSQL e a instancia `db`.
- `src/repositories/usuario.repository.ts`: concentra as operacoes de persistencia.
- `src/create_entity.ts`: aplica as migracoes SQL no banco.
- `src/insert_entity.ts`: insere usuarios informados pela linha de comando.
- `src/list_users.ts`: lista os usuarios cadastrados.
- `src/demo.ts`: executa um fluxo simples de insercao + listagem.
- `drizzle.config.ts`: configuracao do Drizzle Kit para gerar migracoes.

## Configuracao

Crie um arquivo `.env` com base em `.env.example`.

Exemplo:

```env
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123
POSTGRES_DB=bdaula
POSTGRES_PORT=5432
```

## Como usar

### 1. Gerar a migracao

```bash
npm run db:generate
```

### 2. Aplicar a migracao no banco

```bash
npm run db:migrate
```

### 3. Inserir usuarios

```bash
npm run user:insert -- "Ana" "Bruno" "Carla"
```

### 4. Listar usuarios

```bash
npm run user:list
```

### 5. Executar um exemplo completo

```bash
npm run demo
```

## Observacao didatica

Este projeto separa bem 3 responsabilidades:

- **schema**: como a tabela e definida
- **repositorio**: como os dados sao gravados e lidos
- **scripts**: como a aplicacao usa o repositorio no console

Assim fica facil mostrar em aula onde entra o ORM e onde entra a regra da aplicacao.
