import { z } from "zod";

import { orm, schema } from "@aniways/db";
import { scrapeVideoSource } from "@aniways/web-scraping";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const episodesRouter = createTRPCRouter({
  scrapeVideoUrl: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await scrapeVideoSource(input.slug);
    }),

  updateVideoUrl: publicProcedure
    .input(
      z.object({
        id: z.string(),
        slug: z.string(),
        videoUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(schema.video)
        .set({
          videoUrl: input.videoUrl,
        })
        .where(
          orm.and(
            orm.eq(schema.video.animeId, input.id),
            orm.eq(schema.video.slug, input.slug),
          ),
        );
    }),

  getEpisodesOfAnime: publicProcedure
    .input(z.object({ animeId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .selectDistinctOn([schema.video.episode])
        .from(schema.video)
        .where(orm.eq(schema.video.animeId, input.animeId))
        .orderBy(orm.asc(schema.video.episode));
    }),

  getEpisodeByAnimeIdAndEpisode: publicProcedure
    .input(
      z.object({
        animeId: z.string(),
        episode: z.coerce.number().transform((e) => String(e)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [video] = await ctx.db
        .select()
        .from(schema.video)
        .where(
          orm.and(
            orm.eq(schema.video.animeId, input.animeId),
            orm.eq(schema.video.episode, input.episode),
          ),
        );

      return video;
    }),

  getFirstEpisodeByAnimeId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [video] = await ctx.db
        .select({
          episode: schema.video.episode,
        })
        .from(schema.video)
        .where(orm.eq(schema.video.animeId, input.id))
        .orderBy(orm.asc(schema.video.episode))
        .limit(1);

      return {
        episode: video?.episode,
      };
    }),
});
