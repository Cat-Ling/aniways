import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { settingsRouter } from "./routers/settings";

export const appRouter = createTRPCRouter({
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
