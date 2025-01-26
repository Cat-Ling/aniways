import { client, db } from "@/server/db";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import config from "drizzle.config";
import { type Sql } from "postgres";

async function waitForDB(client: Sql, retries = 50, delay = 5000) {
  while (retries > 0) {
    try {
      await client`SELECT 1`;
      console.log("Database is ready");
      return;
    } catch {
      console.log("Database not ready, retrying...");
      retries--;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Database not ready after multiple retries.");
}

export async function migrateDB() {
  const isBuilding = process.env.npm_lifecycle_event === "build";

  if (isBuilding) {
    console.log("Skipping database migrations during build");
    return;
  }

  const lockId = 123456; // Unique ID for the lock

  try {
    await waitForDB(client);

    await client`SELECT pg_advisory_lock(${lockId})`;

    await migrate(db, {
      migrationsFolder: config.out ?? "drizzle",
    });

    console.log("Database migrations complete");
  } catch {
    console.log("Database migrations failed");
  } finally {
    await client`SELECT pg_advisory_unlock(${lockId})`;
  }
}
