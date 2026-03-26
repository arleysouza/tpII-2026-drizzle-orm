# Exemplo com Drizzle ORM

Projeto em TypeScript para demonstrar o uso do **Drizzle ORM** com **PostgreSQL**, sem Express e sem interface web.

O foco do exemplo é:

- definir o schema da tabela `users`
- gerar migrações com o Drizzle Kit
- aplicar as migrações no banco
- inserir usuários
- listar usuários

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
- `src/db.ts`: cria a conexão com PostgreSQL e a instância `db`.
- `src/repositories/usuario.repository.ts`: concentra as operações de persistência.
- `src/create_entity.ts`: aplica as migrações SQL no banco.
- `src/insert_entity.ts`: insere usuários informados pela linha de comando.
- `src/list_users.ts`: lista os usuários cadastrados.
- `src/demo.ts`: executa um fluxo simples de inserção + listagem.
- `drizzle.config.ts`: configuração do Drizzle Kit para gerar migrações.

## Configuração

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

### 1. Gerar a migração

```bash
npm run db:generate
```

O comando `db:generate` lê o schema definido em `src/db/schema.ts` e gera os arquivos SQL de migração dentro da pasta `drizzle/`.

### 2. Aplicar a migração no banco

```bash
npm run db:migrate
```

O comando `db:migrate` executa as migrações geradas e cria a tabela `users` no PostgreSQL, se ela ainda não existir.

### 3. Inserir usuários

```bash
npm run user:insert -- "Ana" "Bruno" "Carla"
```

O comando `user:insert` recebe um ou mais nomes pela linha de comando e persiste cada usuário na tabela `users`.

### 4. Listar usuários

```bash
npm run user:list
```

O comando `user:list` consulta a tabela `users` e mostra os registros no console com `console.table`.

### 5. Executar um exemplo completo

```bash
npm run demo
```

O comando `demo` executa um fluxo completo de exemplo: insere alguns usuários fixos e depois lista o conteúdo da tabela.

## Outros comandos

```bash
npm run build
npm run db:studio
```

- `build`: compila os arquivos TypeScript para a pasta `dist/`.
- `db:studio`: abre a interface visual do Drizzle Studio para inspecionar as tabelas e os dados do banco.

## Observação didática

Este projeto separa bem 3 responsabilidades:

- **schema**: como a tabela é definida
- **repositório**: como os dados são gravados e lidos
- **scripts**: como a aplicação usa o repositório no console

Assim fica fácil mostrar em aula onde entra o ORM e onde entra a regra da aplicação.
