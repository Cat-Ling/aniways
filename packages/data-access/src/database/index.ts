import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import * as orm from 'drizzle-orm';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const connectionString = process.env.DATABASE_URL!;

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

export { db, schema, orm };
