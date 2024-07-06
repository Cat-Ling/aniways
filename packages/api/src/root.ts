import { animeRouter } from "./router/anime";
import { episodesRouter } from "./router/episodes";
import { myAnimeListRouter } from "./router/myanimelist";
import { seasonalAnimeRouter } from "./router/seasonal-anime";
import { settingsRouter } from "./router/settings";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  anime: animeRouter,
  episodes: episodesRouter,
  myAnimeList: myAnimeListRouter,
  seasonalAnime: seasonalAnimeRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
