import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import { appRouter, createTRPCContext } from "@aniways/trpc";

const createContext = (
  options: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>
) => {
  const headers = new Headers();

  for (const key in options.event.headers) {
    const value = options.event.headers[key];
    if (!value) continue;
    headers.set(key, value);
  }

  const cookies = new Map<string, string>();
  options.event.cookies?.forEach(cookie => {
    const [name, value] = cookie.split("=");
    if (!name || !value) return;
    cookies.set(name, value);
  });

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

const allowedOrigins = ["https://aniways.xyz"];
const allowedMethods = ["GET", "POST"];
const allowedHeaders = [
  "content-type",
  "cookie",
  "trpc-batch-mode",
  "x-trpc-source",
];

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
  responseMeta: () => ({
    headers: {
      "Access-Control-Allow-Origin": allowedOrigins.join(","),
      "Access-Control-Allow-Methods": allowedMethods.join(","),
      "Access-Control-Allow-Headers": allowedHeaders.join(","),
      "Access-Control-Allow-Credentials": "true",
    },
  }),
  onError: ({ error, path }) => {
    console.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`, error);
  },
});
