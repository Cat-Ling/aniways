import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createId, orm, schema } from "@aniways/db";
import { getAnimeList } from "@aniways/myanimelist";
import { scrapeAllEpisodes, searchAniList } from "@aniways/web-scraping";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const animeRouter = createTRPCRouter({
  recentlyReleased: publicProcedure
    .input(z.object({ page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const recentlyReleased = await ctx.db
        .select({
          id: schema.anime.id,
          title: schema.anime.title,
          image: schema.anime.image,
          lastEpisode: schema.anime.lastEpisode,
        })
        .from(schema.anime)
        .where(
          orm.and(
            orm.notLike(schema.anime.title, "%Dub%"),
            orm.notLike(schema.anime.title, "%dub%"),
            orm.isNotNull(schema.anime.lastEpisode)
          )
        )
        .orderBy(orm.desc(schema.anime.updatedAt))
        .limit(21)
        .offset((input.page - 1) * 20);

      const hasNext = recentlyReleased.length > 20;

      if (hasNext) {
        recentlyReleased.pop();
      }

      return {
        recentlyReleased,
        hasNext,
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const [anime] = await ctx.db
        .select()
        .from(schema.anime)
        .where(orm.eq(schema.anime.id, id))
        .limit(1);

      return anime;
    }),

  continueWatching: protectedProcedure.query(async ({ ctx }) => {
    const animeList = await getAnimeList(
      ctx.session.accessToken,
      ctx.session.user.name,
      1,
      50,
      "watching"
    );

    const currentlyWatchingAnime = await ctx.db
      .select({
        id: schema.anime.id,
        title: schema.anime.title,
        image: schema.anime.image,
        malAnimeId: schema.anime.malAnimeId,
        lastEpisode: schema.anime.lastEpisode,
      })
      .from(schema.anime)
      .where(
        orm.inArray(
          schema.anime.malAnimeId,
          animeList.data.map(({ node }) => node.id)
        )
      );

    const embeddedCurrentlyWatchingAnime = currentlyWatchingAnime
      // embed last watched episode and last updated at
      .map(anime => {
        const malAnime = animeList.data.find(
          ({ node }) => node.id === anime.malAnimeId
        );

        if (!malAnime) return undefined;

        const { my_list_status } = malAnime.node;

        return {
          ...anime,
          lastWatchedEpisode: my_list_status?.num_episodes_watched,
          lastUpdatedAt: my_list_status?.updated_at,
        };
      })
      .filter(anime => anime !== undefined) as (schema.Anime & {
      lastWatchedEpisode: number | undefined;
      lastUpdatedAt: string | undefined;
    })[];

    return (
      embeddedCurrentlyWatchingAnime
        // filter out animes that have all episodes watched
        .filter(anime => {
          const lastEpisodeReleased = Number(anime.lastEpisode);

          return anime.lastWatchedEpisode !== lastEpisodeReleased;
        })
        // transfrom last watched episode to next episode to watch
        .map(anime => {
          const episodesWatched = anime.lastWatchedEpisode;

          const lastEpisode = String(
            episodesWatched !== undefined ?
              episodesWatched + 1
            : anime.lastEpisode
          );

          return {
            ...anime,
            lastEpisode,
          };
        })
        // sort by last updated at
        .sort((a, b) => {
          if (!a.lastUpdatedAt || !b.lastUpdatedAt) return 0;

          return new Date(a.lastUpdatedAt) > new Date(b.lastUpdatedAt) ? -1 : 1;
        })
    );
  }),

  seedMissingEpisodes: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [anime] = await ctx.db
        .select()
        .from(schema.anime)
        .where(orm.eq(schema.anime.slug, input.slug))
        .limit(1);

      if (!anime) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Anime not found",
        });
      }

      const { episodes, animeSlug } = await scrapeAllEpisodes(input.slug);

      if (!episodes.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No episodes found for this anime",
        });
      }

      await ctx.db
        .update(schema.anime)
        .set({
          slug: animeSlug,
          lastEpisode: String(
            episodes.sort((a, b) => a.episode - b.episode).pop()?.episode
          ),
        })
        .where(orm.eq(schema.anime.id, anime.id));

      await ctx.db.insert(schema.video).values(
        episodes.map(({ episode, episodeSlug }) => ({
          id: createId(),
          animeId: anime.id,
          slug: episodeSlug,
          episode: String(episode),
        }))
      );

      return episodes.sort((a, b) => a.episode - b.episode).at(0)?.episode;
    }),

  search: publicProcedure
    .input(z.object({ query: z.string(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const results = await searchAniList(input.query, input.page);

      const slugs = results.media
        .map(data => data?.slug)
        .filter(Boolean) as string[];

      if (slugs.length === 0) {
        return {
          animes: [],
          hasNext: false,
        };
      }

      const animes = await ctx.db
        .select({
          id: schema.anime.id,
          title: schema.anime.title,
          image: schema.anime.image,
          lastEpisode: schema.anime.lastEpisode,
          slug: schema.anime.slug,
        })
        .from(schema.anime)
        .where(orm.inArray(schema.anime.slug, slugs));

      return {
        animes: results.media
          .map(data => {
            const anime = animes.find(anime => anime.slug === data?.slug);

            if (!anime) return undefined;

            return {
              id: anime.id,
              title: anime.title,
              image: anime.image,
              lastEpisode: anime.lastEpisode,
            };
          })
          .filter(Boolean) as {
          id: string;
          title: string;
          image: string;
          lastEpisode: string;
        }[],
        hasNext: results.pageInfo.hasNextPage,
      };
    }),

  updateMalAnimeId: publicProcedure
    .input(z.object({ id: z.string(), malId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(schema.anime)
        .set({ malAnimeId: input.malId })
        .where(orm.eq(schema.anime.id, input.id));
    }),
});
