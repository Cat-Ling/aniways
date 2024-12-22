import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const hiAnimeRouter = createTRPCRouter({
  random: publicProcedure.query(async ({ ctx }) => {
    const random = await ctx.hiAnimeScraper.getRandomAnime();

    return random;
  }),

  search: publicProcedure
    .input(z.object({ query: z.string(), page: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { query, page } = input;

      const results = await ctx.hiAnimeScraper.search(query, page);

      return results;
    }),
});
