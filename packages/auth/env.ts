/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as myAnimeListEnv } from "@aniways/myanimelist/env";

export const env = createEnv({
  extends: [myAnimeListEnv],
  server: {
    MAL_CLIENT_SECRET: z.string(),
    MAL_SECRET_KEY: z.string().base64().length(44),
    MAL_REQUEST_DEBUG:
      process.env.NODE_ENV === "development"
        ? z.literal(true).optional()
        : z.boolean().optional(),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
