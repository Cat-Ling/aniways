import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { SearchFilterSchema } from "@/lib/hianime";

export const hiAnimeRouter = createTRPCRouter({
  random: publicProcedure.query(({ ctx }) =>
    ctx.hiAnimeScraper.getRandomAnime(),
  ),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().optional(),
        filters: SearchFilterSchema.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, page, filters } = input;

      return await ctx.hiAnimeScraper.search(query, page ?? 1, filters);
    }),

  getSyncData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const info = await ctx.hiAnimeScraper.getSyncData(input.id);

      const isInDB = await ctx.mapper.hasInDB({ hiAnimeId: input.id });

      if (!isInDB) {
        await ctx.mapper.addMapping({
          hiAnimeId: input.id,
          malId: info.malId,
          anilistId: info.anilistId,
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
      ctx.hiAnimeScraper.getEpisodeSources(input.id, input.episode),
    ),

  getRecentlyAdded: publicProcedure
    .input(z.object({ page: z.number().optional() }))
    .query(({ ctx, input }) =>
      ctx.hiAnimeScraper.getRecentlyReleased(input.page ?? 1),
    ),

  getTrendingAnime: publicProcedure.query(({ ctx }) =>
    ctx.hiAnimeScraper.getTrendingAnime(),
  ),

  getTopAnime: publicProcedure.query(({ ctx }) =>
    ctx.hiAnimeScraper.getTopAnime(),
  ),

  getGenreAnime: publicProcedure
    .input(z.object({ genre: z.string(), page: z.number().default(1) }))
    .query(({ ctx, input }) =>
      ctx.hiAnimeScraper.getGenreAnime(input.genre, input.page),
    ),

  getAZList: publicProcedure
    .input(z.object({ page: z.number().default(1) }))
    .query(({ ctx, input }) => ctx.hiAnimeScraper.getAZList(input.page)),
});
