export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { migrateDB } = await import("@/server/db/migrate");
    await migrateDB();
  }
}
