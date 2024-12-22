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

  getInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => ctx.hiAnimeScraper.getInfo(input.id)),

  getEpisodes: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => ctx.hiAnimeScraper.getEpisodes(input.id)),

  getEpisodeSources: publicProcedure
    .input(z.object({ id: z.string(), episode: z.number() }))
    .query(({ ctx, input }) =>
      ctx.hiAnimeScraper.getEpisodeSrc(input.id, input.episode),
    ),
});
