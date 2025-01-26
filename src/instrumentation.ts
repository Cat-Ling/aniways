export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { migrateDB } = await import("@/server/db/migrate");
    await migrateDB();
  }

  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "production"
  ) {
    await import("pino");
    // @ts-expect-error: This is a dynamic import
    await import("next-logger");
  }
}
