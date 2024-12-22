import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const watchStatus = [
  "watching",
  "completed",
  "on_hold",
  "dropped",
  "plan_to_watch",
  "all",
] as const;

export const malRouter = createTRPCRouter({
  getAnimeListOfUser: protectedProcedure
    .input(
      z.object({
        cursor: z.number().transform((val) => (val < 1 ? 1 : val)),
        status: z.enum(watchStatus),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { status } = input;
      const page = input.cursor;

      const {
        user: { name: username },
      } = ctx.session;

      const animeList = await ctx.malScraper.getAnimeList({
        username,
        page,
        limit: 50,
        status: status === "all" ? undefined : status,
      });

      if (!animeList.data.length) {
        return {
          anime: [],
          hasNext: false,
        };
      }

      return {
        anime: await Promise.all(
          animeList.data.map(async (anime) => {
            const hiAnimeId = await ctx.hiAnimeScraper.getHiAnimeIdFromMalId(
              anime.node.id,
            );

            return {
              ...anime.node,
              hiAnimeId,
            };
          }),
        ),
        hasNext: !!animeList.paging.next,
      };
    }),

  getAnimeInfo: publicProcedure
    .input(z.object({ malId: z.number() }))
    .query(async ({ input, ctx }) => {
      const info = await ctx.malScraper.getInfo(input.malId);

      if (!info) return;

      return {
        ...info,
        recommendations: await Promise.all(
          info?.recommendations?.map(async (rec) => {
            const hiAnimeId = await ctx.hiAnimeScraper.getHiAnimeIdFromMalId(
              rec.node.id,
            );

            return {
              ...rec,
              hiAnimeId,
            };
          }) ?? [],
        ),
        relatedAnime: await Promise.all(
          info?.relatedAnime?.map(async (related) => {
            const hiAnimeId = await ctx.hiAnimeScraper.getHiAnimeIdFromMalId(
              related.node.id,
            );

            return {
              ...related,
              hiAnimeId,
            };
          }) ?? [],
        ),
      };
    }),

  getAnimeStatusInMAL: publicProcedure
    .input(z.object({ malId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.malScraper
        .getInfo(input.malId)
        .then((data) => data?.listStatus);
    }),

  getTrailer: publicProcedure
    .input(z.object({ malId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.malScraper.getTrailer(input.malId);
    }),

  addEntryToMal: protectedProcedure
    .input(z.object({ malId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.malScraper.updateEntry({
        malId: input.malId,
      });
    }),

  updateEntryInMal: protectedProcedure
    .input(
      z.object({
        malId: z.number(),
        status: z.enum(watchStatus).exclude(["all"]),
        numWatchedEpisodes: z.number(),
        score: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.malScraper.updateEntry({
        malId: input.malId,
        status: input.status,
        numWatchedEpisodes: input.numWatchedEpisodes,
        score: input.score,
      });
    }),

  deleteEntryInMal: protectedProcedure
    .input(z.object({ malId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.malScraper.deleteEntry({ malId: input.malId });
    }),
});
