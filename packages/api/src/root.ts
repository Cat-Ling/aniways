import { animeRouter } from "./router/anime";
import { episodesRouter } from "./router/episodes";
import { myAnimeListRouter } from "./router/myanimelist";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	anime: animeRouter,
	episodes: episodesRouter,
	myAnimeList: myAnimeListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
