import { z } from "zod";

import { createId, orm, schema } from "@aniways/db";
import { getCurrentAnimeSeason } from "@aniways/myanimelist";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const seasonalAnimeRouter = createTRPCRouter({
  getCurrentSeasonalAnimes: publicProcedure.query(async ({ ctx }) => {
    const currentSeasonAnime = await getCurrentAnimeSeason().then(
      ({ data }) => {
        const ids = data.map(anime => anime.mal_id).filter(Boolean) as number[];

        const dedupedIds = [...new Set(ids)];

        return dedupedIds
          .map(id => data.find(anime => anime.mal_id === id))
          .filter(Boolean)
          .slice(0, 10) as ((typeof data)[number] & { mal_id: number })[];
      }
    );

    const animes = await ctx.db
      .select()
      .from(schema.anime)
      .where(
        orm.inArray(
          schema.anime.malAnimeId,
          currentSeasonAnime.map(anime => anime.mal_id)
        )
      );

    return currentSeasonAnime.map(anime => ({
      ...anime,
      mal_id: anime.mal_id,
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
          episodes: z.number().nullable().optional(),
          synopsis: z.string(),
          imageUrl: z.string(),
          status: z.string(),
          title: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async tx => {
        await tx.delete(schema.seasonalAnime);

        await tx.insert(schema.seasonalAnime).values(
          input.map(data => ({
            ...data,
            id: createId(),
          }))
        );
      });
    }),
});
