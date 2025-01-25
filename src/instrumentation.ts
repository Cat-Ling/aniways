import { migrateDB } from "@/server/db/migrate";

export async function register() {
  await migrateDB();

  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "production"
  ) {
    await import("pino");
    // @ts-expect-error: This is a dynamic import
    await import("next-logger");
  }
}
