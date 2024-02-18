import * as orm from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// eslint-disable-next-line no-undef
const globalForDrizzle = globalThis as unknown as {
  db?: PostgresJsDatabase<typeof schema>;
};

const db =
  globalForDrizzle.db ??
  drizzle(postgres(connectionString, { prepare: false }), {
    schema,
  });

// eslint-disable-next-line turbo/no-undeclared-env-vars
if (process.env.NODE_ENV === 'development') {
  globalForDrizzle.db = db;
}

export default db;

export { db, orm, schema };
