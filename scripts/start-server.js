const { exec } = require("child_process");

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });

    // Forward output to the main process
    process.stdout.pipe(process.stdout);
    process.stderr.pipe(process.stderr);
  });
}

async function main() {
  try {
    console.log("Starting database migration...");
    await runCommand("bun run dist/migrate.js");

    console.log("Migration successful. Starting server...");
    await runCommand("bun run server.js");
  } catch (error) {
    console.error("Migration failed. Server not started.");
    process.exit(1); // Exit with failure code
  }
}

main();
