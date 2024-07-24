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

const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "content-type, cookie, trpc-batch-mode, x-trpc-source"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = async (req: NextRequest) => {
  // return a 404 in production because we want to use the api service
  if (env.NODE_ENV === "production") notFound();

  // Only use this for development
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError({ error, path }) {
      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`, error);
    },
  });

  setCorsHeaders(response);

  return response;
};

export { handler as GET, handler as POST };
