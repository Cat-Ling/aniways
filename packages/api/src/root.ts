import { animeRouter } from "./router/anime";
import { episodesRouter } from "./router/episodes";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  anime: animeRouter,
  episodes: episodesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
