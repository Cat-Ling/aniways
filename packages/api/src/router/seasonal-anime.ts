import { z } from "zod";

import { createId, orm, schema } from "@aniways/db";
import { getCurrentAnimeSeason } from "@aniways/myanimelist";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const seasonalAnimeRouter = createTRPCRouter({
  getCurrentSeasonalAnimes: publicProcedure.query(async ({ ctx }) => {
    const currentSeasonAnime = await getCurrentAnimeSeason().then(({ data }) =>
      data.filter(data => data.mal_id !== undefined).slice(0, 10)
    );

    const animes = await ctx.db
      .select()
      .from(schema.anime)
      .where(
        orm.inArray(
          schema.anime.malAnimeId,
          currentSeasonAnime.map(anime => anime.mal_id) as number[]
        )
      );

    return currentSeasonAnime.map(anime => ({
      ...anime,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mal_id: anime.mal_id!,
      anime: animes.find(dbAnime => dbAnime.malAnimeId === anime.mal_id),
    }));
  }),

  getCachedSeasonalAnimes: publicProcedure.query(async ({ ctx }) => {
    const seasonalAnimes = await ctx.db
      .select()
      .from(schema.seasonalAnime)
      .leftJoin(
        schema.anime,
        orm.eq(schema.anime.malAnimeId, schema.seasonalAnime.malId)
      )
      .orderBy(orm.asc(schema.seasonalAnime.order));

    return seasonalAnimes.map(anime => ({
      ...anime.seasonal_anime,
      animeFromDb: anime.anime,
    }));
  }),

  saveSeasonalAnimes: publicProcedure
    .input(
      z.array(
        z.object({
          malId: z.number(),
          order: z.number(),
          rating: z.string(),
          type: z.string(),
          episodes: z.number().optional(),
          synopsis: z.string(),
          imageUrl: z.string(),
          status: z.string(),
          title: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(schema.seasonalAnime);

      await ctx.db.insert(schema.seasonalAnime).values(
        input.map(data => ({
          ...data,
          id: createId(),
        }))
      );
    }),
});
