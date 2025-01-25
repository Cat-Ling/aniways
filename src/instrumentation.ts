export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("pino");
    // @ts-expect-error: This is a dynamic import
    await import("next-logger");
  }
}
