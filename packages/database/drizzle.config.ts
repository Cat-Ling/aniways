import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
