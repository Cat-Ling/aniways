import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import SuperJSON from "superjson";

import { api } from "../trpc";

export const useTrpc = () => {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() => {
    return api.createClient({
      links: [
        loggerLink({
          enabled: op =>
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            import.meta.env.DEV ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getUrl(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "manga-vite");
            return headers;
          },
        }),
      ],
    });
  });

  return {
    trpcClient,
    queryClient,
  };
};

const getUrl = () => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (import.meta.env.DEV) {
    return "http://localhost:3000/api/trpc";
  }
  return `https://api.aniways.xyz`;
};
