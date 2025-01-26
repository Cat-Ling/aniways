const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/server/db/migrate.ts"],
    outfile: "dist/migrate.js",
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
  })
  .catch(() => process.exit(1));
