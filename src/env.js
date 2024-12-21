import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    MAL_CLIENT_ID: z.string(),
    MAL_CLIENT_SECRET: z.string(),
    MAL_SECRET_KEY: z.string().base64().length(44),
    MAL_REQUEST_DEBUG:
      process.env.NODE_ENV === "development"
        ? z.literal("true").optional()
        : z.coerce.boolean().optional(),
    DATABASE_URL: z.string().url(),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
