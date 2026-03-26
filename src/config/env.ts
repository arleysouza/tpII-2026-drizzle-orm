import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return value;
}

function getPort(): number {
  const port = Number(getRequiredEnv("POSTGRES_PORT"));

  if (Number.isNaN(port)) {
    throw new Error("POSTGRES_PORT precisa ser um numero valido.");
  }

  return port;
}

export const env = {
  host: getRequiredEnv("POSTGRES_HOST"),
  user: getRequiredEnv("POSTGRES_USER"),
  password: getRequiredEnv("POSTGRES_PASSWORD"),
  database: getRequiredEnv("POSTGRES_DB"),
  port: getPort(),
};
