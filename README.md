# Exemplo de CRUD com Drizzle ORM

Este projeto mostra um CRUD simples em **TypeScript** usando **Drizzle ORM** com **PostgreSQL**.

O objetivo do exemplo é didático: manter o menor número possível de conceitos ao mesmo tempo. Por isso, o projeto:

- não usa Express
- não usa interface web
- não usa migrations
- não usa múltiplas camadas desnecessárias

O fluxo foi reduzido ao essencial:

1. conectar no PostgreSQL
2. garantir a existência da tabela `users`
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

Em vez de introduzir migrations, seed, controller, service e outras camadas, este exemplo mostra apenas o necessário para entender como o ORM entra em uma aplicação.

O Drizzle aparece em dois pontos principais:

- na definição da tabela, usando `pgTable(...)`
- nas operações de banco, como `insert`, `select`, `update` e `delete`

O restante do código é JavaScript/TypeScript comum: função assíncrona, logs no console, tratamento de erro e fechamento de conexão.

## Estrutura atual do projeto

```text
src/
  db.ts
  demo.ts
  repository.ts
  schema.ts
package.json
tsconfig.json
README.md
```

## Papel de cada arquivo

### `src/schema.ts`

Define a estrutura da tabela no Drizzle.

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
- `NovoUsuario`: tipo esperado para inserção

Isso ajuda o TypeScript a validar o código automaticamente.

### `src/db.ts`

Cria a conexão com o PostgreSQL e exporta a instância do Drizzle.

Esse arquivo faz três coisas:

- carrega as variáveis do `.env`
- cria o `Pool` do PostgreSQL
- cria o objeto `db`, que será usado nas consultas

Além disso, ele possui duas funções auxiliares importantes:

- `ensureUsersTable()`: executa um `CREATE TABLE IF NOT EXISTS`
- `closeConnection()`: encerra o pool de conexões

Como o projeto não usa migration, a criação da tabela foi colocada aqui de forma explícita. Isso deixa o exemplo mais simples para aula e evita um passo extra antes de rodar o CRUD.

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

1. garante que a tabela `users` exista
2. cria um usuário com o nome `Ana`
3. mostra os dados após o `CREATE`
4. atualiza o nome para `Ana Maria`
5. mostra os dados após o `UPDATE`
6. remove o usuário criado
7. mostra os dados após o `DELETE`
8. trata erros com `catch`
9. fecha a conexão com o banco no `finally`

Esse fluxo foi montado para deixar visível no console o efeito de cada operação do CRUD.

## Como a tabela é criada

Como o projeto não usa migrations, a tabela é criada por este comando SQL:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL
)
```

Esse SQL é executado automaticamente pela função `ensureUsersTable()` antes do CRUD começar.

### Por que usar `CREATE TABLE IF NOT EXISTS`?

Porque isso permite:

- rodar o exemplo em um banco vazio
- evitar erro caso a tabela já exista
- manter o projeto simples para fins didáticos

Esse tipo de abordagem é bom para exemplo pequeno e aula introdutória. Em projetos reais maiores, normalmente o ideal é usar migrations.

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

O projeto cria a tabela automaticamente, mas não cria o banco. O banco informado em `POSTGRES_DB` precisa existir.

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

## Limitações intencionais do exemplo

Este projeto é propositalmente simples. Por isso, ele não inclui:

- validação avançada de entrada
- API HTTP
- migrations
- testes automatizados
- múltiplas entidades

Nada disso está “faltando por engano”. Foi uma escolha para manter o foco no CRUD com Drizzle.

## Resumo

Se a intenção for ensinar o básico de ORM com PostgreSQL, este projeto mostra o caminho completo com poucos arquivos:

- definição da tabela
- conexão com banco
- operações CRUD
- execução em script único

Isso torna o exemplo pequeno o suficiente para ser explicado em aula sem esconder os conceitos principais atrás de muita estrutura.
