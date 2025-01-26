async function main() {
  await import("./migrate.js");
  await import("./server.js");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
