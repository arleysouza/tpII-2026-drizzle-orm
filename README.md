# Exemplo com Drizzle ORM

Projeto em TypeScript para demonstrar o uso do **Drizzle ORM** com **PostgreSQL**, sem Express e sem interface web.

O exemplo cobre o ciclo completo de CRUD na tabela `users`:

- criar a tabela com migrações
- inserir usuários
- listar usuários
- atualizar usuários
- remover usuários

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
  insert_entity.ts
  update_entity.ts
  delete_entity.ts
  list_users.ts
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
- `src/insert_entity.ts`: insere usuários informados pela linha de comando.
- `src/update_entity.ts`: atualiza o nome de um usuário pelo `id`.
- `src/delete_entity.ts`: remove um usuário pelo `id`.
- `src/list_users.ts`: lista os usuários cadastrados.
- `src/demo.ts`: executa um fluxo simples com inserção, atualização, remoção e listagem.
- `drizzle.config.ts`: configura o Drizzle Kit.
- `drizzle/`: armazena os arquivos de migração gerados.

## Operações do repositório

O arquivo `src/repositories/usuario.repository.ts` centraliza as operações principais do exemplo:

- `criar(nome)`: executa `INSERT`.
- `listar()`: executa `SELECT`.
- `alterar(id, nome)`: executa `UPDATE`.
- `remover(id)`: executa `DELETE`.

Essa separação é útil em aula porque mostra que o script de console não acessa o banco diretamente; ele delega a persistência para o repositório.

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

## Fluxo sugerido para usar em aula

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

### 3. Inserir usuários

```bash
npm run user:insert -- "Ana" "Bruno" "Carla"
```

Recebe um ou mais nomes pela linha de comando e persiste cada usuário na tabela `users`.

### 4. Listar usuários

```bash
npm run user:list
```

Consulta a tabela `users` e mostra os registros no console com `console.table`.

### 5. Atualizar um usuário

```bash
npm run user:update -- 1 "Ana Maria"
```

Recebe o `id` e o novo nome do usuário, executando um `UPDATE` na tabela `users`.

### 6. Remover um usuário

```bash
npm run user:delete -- 1
```

Recebe o `id` e executa um `DELETE` na tabela `users`.

### 7. Executar um exemplo completo

```bash
npm run demo
```

Executa um fluxo completo de demonstração: insere usuários, atualiza um registro, remove outro e lista o resultado final.

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
- **scripts**: como a aplicação usa o repositório no console

Isso ajuda a mostrar em aula onde entra o ORM e onde entra a lógica da aplicação.
