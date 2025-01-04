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
    .query(async ({ ctx, input }) => {
      const info = await ctx.hiAnimeScraper.getInfo(input.id);

      const isInDB = await ctx.mapper.hasInDB({ hiAnimeId: input.id });

      if (!isInDB) {
        await ctx.mapper.addMapping({
          hiAnimeId: input.id,
          malId: info?.anime.info.malId,
          anilistId: info?.anime.info.anilistId,
        });
      }

      return info;
    }),

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

  getTopAnime: publicProcedure.query(({ ctx }) =>
    ctx.hiAnimeScraper.getTopAnime(),
  ),

  getGenres: publicProcedure.query(({ ctx }) => ctx.hiAnimeScraper.getGenres()),

  getGenreAnime: publicProcedure
    .input(z.object({ genre: z.string(), page: z.number().default(1) }))
    .query(({ ctx, input }) =>
      ctx.hiAnimeScraper.getGenreAnime(input.genre, input.page),
    ),
});
