#!/bin/bash

# Run the migration script
bun run migrate.js

# Check if the migration was successful
if [ $? -eq 0 ]; then
  # Run the server script
  bun run server.js
else
  echo "Migration failed. Server not started."
fi