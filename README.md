# Exemplo com Drizzle ORM

Projeto em TypeScript para demonstrar o uso do **Drizzle ORM** com **PostgreSQL**, sem Express e sem interface web.

O exemplo foi simplificado para usar um único arquivo de execução, `src/demo.ts`, que demonstra o ciclo completo de CRUD na tabela `users`:

- cria registros
- lista os dados persistidos
- atualiza um usuário
- remove um usuário
- mostra o resultado final

## Tabela usada

```ts
export const usuarios = pgTable("users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
});
```

## Estrutura do projeto

```text
src/
  config/env.ts
  db.ts
  db/schema.ts
  repositories/usuario.repository.ts
  create_entity.ts
  demo.ts
drizzle/
drizzle.config.ts
```

## Papel de cada arquivo

- `src/config/env.ts`: lê e valida as variáveis do arquivo `.env`.
- `src/db.ts`: cria a conexão com PostgreSQL e exporta a instância `db`.
- `src/db/schema.ts`: define a tabela `users` com Drizzle.
- `src/repositories/usuario.repository.ts`: concentra as operações de persistência.
- `src/create_entity.ts`: aplica as migrações SQL no banco.
- `src/demo.ts`: executa o fluxo didático completo de CRUD.
- `drizzle.config.ts`: configura o Drizzle Kit.
- `drizzle/`: armazena os arquivos de migração gerados.

## Operações do repositório

O arquivo `src/repositories/usuario.repository.ts` centraliza as operações principais do exemplo:

- `criar(nome)`: executa `INSERT`.
- `listar()`: executa `SELECT`.
- `alterar(id, nome)`: executa `UPDATE`.
- `remover(id)`: executa `DELETE`.

Essa separação é útil em aula porque mostra que o script principal não acessa o banco diretamente; ele delega a persistência para o repositório.

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

## Como executar

### 1. Gerar a migração

```bash
npm run db:generate
```

Lê o schema definido em `src/db/schema.ts` e gera os arquivos SQL de migração dentro da pasta `drizzle/`.

### 2. Aplicar a migração no banco

```bash
npm run db:migrate
```

Executa as migrações geradas e cria a tabela `users` no PostgreSQL.

### 3. Rodar a demonstração completa

```bash
npm run demo
```

Executa um fluxo completo de demonstração no arquivo `src/demo.ts`:

- insere usuários de exemplo
- atualiza um dos registros
- remove outro registro
- lista o conteúdo final da tabela

## Outros comandos

```bash
npm run build
npm run db:studio
```

- `build`: compila os arquivos TypeScript para a pasta `dist/`.
- `db:studio`: abre a interface visual do Drizzle Studio para inspecionar tabelas e dados.

## Observação didática

Este projeto separa claramente três responsabilidades:

- **schema**: como a tabela é definida
- **repositório**: como os dados são gravados e lidos
- **demo**: como a aplicação usa o repositório em um fluxo de console

Isso ajuda a mostrar em aula onde entra o ORM e onde entra a lógica da aplicação.
