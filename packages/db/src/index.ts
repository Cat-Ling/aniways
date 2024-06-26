/* eslint-disable no-restricted-properties */
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as orm from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env";
import * as schema from "./schema";

const globalForDrizzle = globalThis as unknown as {
	db?: PostgresJsDatabase<typeof schema>;
};

const client = postgres(env.DATABASE_URL, { prepare: false });

const db =
	globalForDrizzle.db ??
	drizzle(client, {
		schema,
	});

if (process.env.NODE_ENV === "development") {
	globalForDrizzle.db = db;
}

export { createId } from "@paralleldrive/cuid2";
export { client, db, orm, schema };
