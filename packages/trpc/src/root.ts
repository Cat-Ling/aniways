import { animeRouter } from "./router/anime";
import { authRouter } from "./router/auth";
import { episodesRouter } from "./router/episodes";
import { mangaRouter } from "./router/manga";
import { myAnimeListRouter } from "./router/myanimelist";
import { seasonalAnimeRouter } from "./router/seasonal-anime";
import { settingsRouter } from "./router/settings";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  anime: animeRouter,
  episodes: episodesRouter,
  myAnimeList: myAnimeListRouter,
  seasonalAnime: seasonalAnimeRouter,
  manga: mangaRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
