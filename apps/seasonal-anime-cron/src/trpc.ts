import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import SuperJson from "superjson";

import type { AppRouter } from "@aniways/trpc";

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: op =>
        // eslint-disable-next-line no-restricted-properties
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    httpBatchLink({
      transformer: SuperJson,
      url: "https://api.aniways.xyz",
      headers() {
        const headers = new Headers();
        headers.set("x-trpc-source", "healthcheck");
        return headers;
      },
    }),
  ],
});
