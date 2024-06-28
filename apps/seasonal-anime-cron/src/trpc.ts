import { createCaller, createTRPCContext } from "@aniways/api";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = () => {
  const headers = new Headers();
  headers.set("x-trpc-source", "seasonal-anime-cron");

  return createTRPCContext({
    headers: headers,
    cookies: {
      get: () => undefined,
      getAll: () => [],
      has: () => false,
    },
  });
};

export const api = createCaller(createContext);
