/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as authEnv } from "@aniways/auth/env";
import { env as dbEnv } from "@aniways/db/env";

export const env = createEnv({
  extends: [authEnv, dbEnv],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    AWS_CERT_ARN: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
