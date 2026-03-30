# Exemplo de CRUD com Drizzle ORM

Este projeto mostra um CRUD simples em **TypeScript** usando **Drizzle ORM** com **PostgreSQL**.

O objetivo do exemplo é didático: manter o menor número possível de conceitos ao mesmo tempo. Por isso, o projeto:

- não usa Express
- não usa interface web
- usa migrations com Drizzle Kit
- não usa múltiplas camadas desnecessárias

O fluxo foi reduzido ao essencial:

1. gerar e aplicar migrations quando houver mudança de schema
2. conectar no PostgreSQL
3. inserir um registro
4. listar os registros
5. atualizar um registro
6. remover um registro
7. encerrar a conexão

## Tecnologias usadas

- `TypeScript`: linguagem principal do projeto
- `pg`: driver de conexão com PostgreSQL
- `drizzle-orm`: ORM usado para mapear a tabela e executar as operações
- `dotenv`: leitura das variáveis de ambiente do arquivo `.env`
- `tsx`: execução direta dos arquivos TypeScript no desenvolvimento

## Ideia central do exemplo

Em vez de introduzir controller, service, API HTTP e outras camadas, este exemplo mostra apenas o necessário para entender como o ORM entra em uma aplicação.

O Drizzle aparece em dois pontos principais:

- na definição da tabela, usando `pgTable(...)`
- nas operações de banco, como `insert`, `select`, `update` e `delete`

O restante do código é JavaScript/TypeScript comum: função assíncrona, logs no console, tratamento de erro e fechamento de conexão.

## Estrutura atual do projeto

```text
drizzle/
  0000_*.sql
  0001_*.sql
  meta/
src/
  db.ts
  demo.ts
  migrate.ts
  repository.ts
  schema.ts
drizzle.config.js
package.json
tsconfig.json
README.md
```

## Papel de cada arquivo

### `src/schema.ts`

Define a estrutura atual da tabela no Drizzle.

```ts
export const usuarios = pgTable("users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
});
```

Esse arquivo representa o modelo da tabela no código. Ele informa:

- o nome da tabela no banco: `users`
- a coluna `id` como chave primária autoincremental
- a coluna `nome` como texto obrigatório

Também exporta os tipos inferidos pelo Drizzle:

- `Usuario`: tipo de um registro retornado do banco

Isso ajuda o TypeScript a validar o código automaticamente.

### `src/db.ts`

Cria a conexão com o PostgreSQL e exporta a instância do Drizzle.

Esse arquivo faz três coisas:

- carrega as variáveis do `.env`
- cria o `Pool` do PostgreSQL
- cria o objeto `db`, que será usado nas consultas

Além disso, ele exporta `closeConnection()`, usada para encerrar o pool de conexões no fim da execução.

### `src/migrate.ts`

Aplica em runtime as migrations já geradas pelo Drizzle.

Esse arquivo usa:

- `migrate(...)` do `drizzle-orm/node-postgres/migrator`
- a pasta `drizzle`, que também é a pasta configurada em `drizzle.config.js`

Ele é útil quando você quer aplicar migrations por script TypeScript, mas o fluxo principal do projeto também pode usar o CLI do Drizzle Kit.

### `drizzle.config.js`

Centraliza a configuração do Drizzle Kit.

Nele ficam definidos:

- o arquivo de schema
- a pasta de saída das migrations
- o dialeto do banco
- as credenciais de conexão vindas do `.env`

### `drizzle/`

Guarda os arquivos SQL gerados pelo Drizzle Kit e os metadados usados para comparar versões do schema.

Em um fluxo comum:

- cada arquivo `000x_*.sql` representa uma migration
- a pasta `meta/` guarda snapshots e o histórico local das gerações

### `src/repository.ts`

Concentra as operações de acesso ao banco.

As funções exportadas são:

- `create(nome)`: insere um usuário
- `getAll()`: lista todos os usuários
- `update(id, nome)`: altera o nome de um usuário
- `remove(id)`: remove um usuário

Esse arquivo é útil didaticamente porque separa o código de persistência do código de execução do exemplo.

Em outras palavras:

- `demo.ts` mostra o fluxo da aplicação
- `repository.ts` mostra como o banco é acessado

### `src/demo.ts`

É o arquivo principal da demonstração.

Quando você executa `npm run demo`, este arquivo:

1. assume que as migrations já foram aplicadas
2. cria um usuário de exemplo
3. mostra os dados após o `CREATE`
4. atualiza o nome para `Ana Maria`
5. mostra os dados após o `UPDATE`
6. remove o usuário criado
7. mostra os dados após o `DELETE`
8. trata erros com `catch`
9. fecha a conexão com o banco no `finally`

Esse fluxo foi montado para deixar visível no console o efeito de cada operação do CRUD.

## Migrations

Neste projeto, a tabela `users` não é criada manualmente no código de conexão. A estrutura do banco nasce a partir do schema em TypeScript e das migrations geradas pelo Drizzle Kit.

### Como funciona

O fluxo é este:

1. você altera o arquivo `src/schema.ts`
2. roda `npm run migration:generate`
3. o Drizzle compara o schema atual com o histórico da pasta `drizzle/meta`
4. ele gera um novo arquivo SQL em `drizzle/`
5. você roda `npm run migration:runtime` para aplicar no banco

Os scripts disponíveis são:

```bash
npm run migration:generate
npm run migration:runtime
```

O que cada um faz:

- `migration:generate`: gera uma nova migration SQL com base nas mudanças do schema
- `migration:runtime`: aplica as migrations pendentes via `src/migrate.ts`

### Exemplo de alteração

Se você adicionar uma coluna no schema, por exemplo:

```ts
email: text("email").notNull(),
```

o comando `npm run migration:generate` deverá criar uma migration parecida com:

```sql
ALTER TABLE "users" ADD COLUMN "email" text NOT NULL;
```

Depois, `npm run migration:runtime` aplica essa alteração no banco.

### Como desfazer uma migration

No fluxo normal do Drizzle, você não desfaz uma migration antiga com um comando `down`.

Em vez disso, o procedimento recomendado é:

1. alterar novamente o `src/schema.ts` para o estado desejado
2. rodar `npm run migration:generate`
3. revisar a nova migration gerada
4. rodar `npm run migration:runtime`

Exemplo:

- você adicionou `email`
- depois decidiu remover `email`
- então remove a coluna do `schema.ts`
- gera uma nova migration
- o Drizzle pode gerar algo como `ALTER TABLE "users" DROP COLUMN "email";`

Ou seja, o rollback normalmente acontece por compensação em uma migration nova, não apagando a migration antiga.

### Quando apagar uma migration manualmente

Apagar um arquivo de migration só é seguro quando ele ainda não foi aplicado em nenhum banco e ainda não foi compartilhado com outras pessoas.

Se a migration estiver apenas local, você pode remover:

- o arquivo `drizzle/000x_*.sql`
- o snapshot correspondente em `drizzle/meta`
- a entrada correspondente em `drizzle/meta/_journal.json`

Se ela já foi aplicada, o caminho correto é criar uma migration nova revertendo a mudança.

## Como o CRUD funciona neste projeto

### Create

A função `create(nome)` usa:

```ts
db.insert(usuarios).values({ nome }).returning();
```

Isso insere um registro na tabela `users` e devolve o usuário criado.

### Read

A função `getAll()` usa:

```ts
db.select().from(usuarios).orderBy(asc(usuarios.id));
```

Isso lista todos os usuários ordenados pelo `id`.

### Update

A função `update(id, nome)` usa:

```ts
db.update(usuarios).set({ nome }).where(eq(usuarios.id, id)).returning();
```

Isso altera o nome do usuário com o `id` informado e devolve o registro atualizado.

### Delete

A função `remove(id)` usa:

```ts
db.delete(usuarios).where(eq(usuarios.id, id)).returning();
```

Isso remove o usuário informado e devolve o registro excluído.

## Pré-requisitos

Antes de executar o projeto, você precisa ter:

- Node.js instalado
- npm instalado
- PostgreSQL em execução
- um banco já criado no PostgreSQL

As migrations criam a tabela automaticamente, mas não criam o banco. O banco informado em `POSTGRES_DB` precisa existir.

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com este conteúdo:

```env
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123
POSTGRES_DB=bdaula
POSTGRES_PORT=5432
```

### Significado de cada variável

- `POSTGRES_HOST`: endereço do servidor PostgreSQL
- `POSTGRES_USER`: usuário do banco
- `POSTGRES_PASSWORD`: senha do usuário
- `POSTGRES_DB`: nome do banco que já deve existir
- `POSTGRES_PORT`: porta do PostgreSQL

## Instalação

Instale as dependências com:

```bash
npm install
```

## Execução

### Gerar e aplicar migrations

```bash
npm run migration:generate
npm run migration:runtime
```

### Rodar o exemplo

```bash
npm run demo
```

Saída esperada, de forma resumida:

- mensagem informando que a tabela está pronta
- usuário criado
- listagem após criação
- usuário atualizado
- listagem após atualização
- usuário removido
- listagem final

### Compilar o projeto

```bash
npm run build
```

Esse comando usa o TypeScript para gerar os arquivos compilados na pasta `dist/`.

## Tratamento de erro

O arquivo `src/demo.ts` usa:

- `catch(...)` para registrar falhas
- `finally(...)` para garantir o fechamento da conexão

Isso é importante porque:

- erros do banco precisam aparecer de forma clara
- conexões abertas não devem ficar presas após o fim do script

## Observações didáticas

Este projeto foi organizado para destacar três ideias:

- **schema**: descreve a tabela
- **repository**: concentra as consultas
- **demo**: mostra o fluxo completo de uso

Essa separação ajuda a explicar onde termina a lógica de banco e onde começa a lógica da aplicação.
