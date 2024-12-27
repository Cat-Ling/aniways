import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const hiAnimeRouter = createTRPCRouter({
  random: publicProcedure.query(({ ctx }) =>
    ctx.hiAnimeScraper.getRandomAnime(),
  ),

  search: publicProcedure
    .input(z.object({ query: z.string(), page: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { query, page } = input;

      return await ctx.hiAnimeScraper.search(query, page);
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

  getRecentlyAdded: publicProcedure
    .input(z.object({ page: z.number().optional() }))
    .query(({ ctx, input }) =>
      ctx.hiAnimeScraper.getRecentlyReleased(input.page),
    ),

  getTrendingAnime: publicProcedure.query(({ ctx }) =>
    ctx.hiAnimeScraper.getTrendingAnime(),
  ),
});
