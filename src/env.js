import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { config } from "dotenv";

if (process.env.NODE_ENV === "production") {
  config({
    path: "/run/secrets/env",
    override: true,
  });
}

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  server: {
    MAL_CLIENT_ID: z.string(),
    MAL_CLIENT_SECRET: z.string(),
    MAL_SECRET_KEY: z.string().base64().length(44),
    MAL_REQUEST_DEBUG:
      process.env.NODE_ENV === "development"
        ? z.literal("true").optional()
        : z.coerce.boolean().optional(),
    DATABASE_URL: z.string().url(),
    CRON_KEY: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
