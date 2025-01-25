import * as orm from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import config from "drizzle.config";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "./schema";

const globalForDrizzle = globalThis as unknown as {
  client?: postgres.Sql;
};

const client =
  globalForDrizzle.client ??
  postgres(env.DATABASE_URL, {
    prepare: false,
  });

if (process.env.NODE_ENV === "development") {
  globalForDrizzle.client = client;
}

const db = drizzle(client, {
  schema,
});

await migrate(db, {
  migrationsFolder: config.out ?? "./src/server/db/migrations",
}).catch((error) => {
  console.error(error);
});

export { client, db, orm, schema };
