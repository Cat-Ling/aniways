import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts',
  driver: 'pg',
  dbCredentials: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
