import type { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@aniways/trpc";

import { env } from "~/env";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
    cookies: req.cookies,
  });
};

const handler = (req: NextRequest) => {
  // return a 404 in production because we want to use the api service
  if (env.NODE_ENV === "production") notFound();

  // Only use this for development
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError({ error, path }) {
      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`, error);
    },
  });
};

export { handler as GET, handler as POST };
