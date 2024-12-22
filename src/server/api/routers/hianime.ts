import { createTRPCRouter, publicProcedure } from "../trpc";

export const hiAnimeRouter = createTRPCRouter({
  random: publicProcedure.query(async ({ ctx }) => {
    const random = await ctx.hiAnimeScraper.getRandomAnime();

    return random;
  }),
});
