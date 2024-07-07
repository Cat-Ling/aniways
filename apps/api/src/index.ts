import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import { appRouter, createTRPCContext } from "@aniways/trpc";

const createContext = (
  options: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>
) => {
  const headers = new Headers();

  for (const key in options.event.headers) {
    const value = options.event.headers[key];
    if (!value) continue;
    headers.set(key, value);
  }

  const cookies = new Map<string, string>();
  if (options.event.headers.cookie) {
    options.event.headers.cookie.split(";").forEach(cookie => {
      const [key, value] = cookie.split("=");
      if (!key || !value) return;
      cookies.set(key.trim(), value.trim());
    });
  }

  return createTRPCContext({
    headers: headers,
    cookies: {
      ...cookies,
      get: (name: string) => {
        const cookie = cookies.get(name);
        if (!cookie) return undefined;
        return { name, value: cookie };
      },
      getAll: () => {
        const entries = cookies.entries();
        const result = [];
        for (const [key, value] of entries) {
          result.push({ name: key, value });
        }
        return result;
      },
    },
  });
};

export const handler = awsLambdaRequestHandler({
  createContext,
  router: appRouter,
  onError({ error, path }) {
    console.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`, error);
  },
});
