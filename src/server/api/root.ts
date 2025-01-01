import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { settingsRouter } from "./routers/settings";
import { malRouter } from "./routers/mal";
import { hiAnimeRouter } from "./routers/hianime";

export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  mal: malRouter,
  hiAnime: hiAnimeRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
