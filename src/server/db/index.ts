import * as orm from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
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

export { client, db, orm, schema };
