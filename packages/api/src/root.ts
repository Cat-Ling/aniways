import { animeRouter } from "./router/anime";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  anime: animeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
