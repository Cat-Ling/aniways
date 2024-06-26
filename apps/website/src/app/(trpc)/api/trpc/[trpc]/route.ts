import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@aniways/api";

export const runtime = "edge";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
    cookies: req.cookies,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError({ error, path }) {
      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`, error);
    },
  });

export { handler as GET, handler as POST };
