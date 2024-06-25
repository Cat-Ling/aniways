import { z } from "zod";

import { orm, schema } from "@aniways/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const animeRouter = createTRPCRouter({
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [anime] = await ctx.db
        .select()
        .from(schema.anime)
        .where(orm.eq(schema.anime.id, input.id))
        .limit(1);

      return anime;
    }),

  byIdWithFirstEpisode: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [anime] = await ctx.db
        .select()
        .from(schema.anime)
        .where(orm.eq(schema.anime.id, input.id))
        .limit(1);

      if (!anime) return null;

      const [episodes] = await ctx.db
        .select({
          episode: schema.video.episode,
        })
        .from(schema.video)
        .where(orm.eq(schema.video.animeId, input.id))
        .orderBy(orm.asc(schema.video.episode))
        .limit(1);

      return { ...anime, firstEpisode: episodes?.episode ?? null };
    }),
});
