import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { settingsRouter } from "./routers/settings";
import { malRouter } from "./routers/mal";

export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  mal: malRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
