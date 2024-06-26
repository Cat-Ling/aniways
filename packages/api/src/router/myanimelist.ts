import { z } from "zod";

import { orm, schema } from "@aniways/db";
import {
	addToAnimeList,
	deleteFromAnimeList,
	getAnimeDetailsFromMyAnimeList,
	getAnimeList,
	getCurrentAnimeSeason,
	searchAnimeFromMyAnimeList,
	updateAnimeList,
} from "@aniways/myanimelist";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const watchStatus = [
	"watching",
	"completed",
	"on_hold",
	"dropped",
	"plan_to_watch",
	"all",
] as const;

export const myAnimeListRouter = createTRPCRouter({
	getAnimeListOfUser: protectedProcedure
		.input(
			z.object({
				page: z.number().transform((val) => (val < 1 ? 1 : val)),
				status: z.enum(watchStatus),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { page, status } = input;
			const {
				accessToken,
				user: { name },
			} = ctx.session;

			const animeList = await getAnimeList(
				accessToken,
				name,
				page,
				20,
				status !== "all" ? status : undefined,
			);

			if (!animeList.data.length) {
				return {
					anime: [],
					hasNext: false,
				};
			}

			const dbAnimes = await ctx.db
				.select()
				.from(schema.anime)
				.where(
					orm.inArray(
						schema.anime.malAnimeId,
						animeList.data.map(({ node: anime }) => anime.id),
					),
				);

			return {
				anime: animeList.data.map((anime) => {
					const dbAnime = dbAnimes.find(
						(dbAnime) => dbAnime.malAnimeId === anime.node.id,
					);

					return {
						...anime.node,
						dbAnime,
					};
				}),
				hasNext: !!animeList.paging.next,
			};
		}),

	getAnimeMetadata: publicProcedure
		.input(
			z.union([
				z.object({ title: z.string() }),
				z.object({ malId: z.number() }),
			]),
		)
		.query(async ({ ctx, input }) => {
			const metadata = await getAnimeDetailsFromMyAnimeList({
				accessToken: ctx.session?.accessToken,
				...input,
			});

			if (!metadata) return;

			if (!metadata.relatedAnime.length)
				return {
					...metadata,
					relatedAnime: [],
				};

			const malIds = metadata.relatedAnime.map((anime) => anime.node.id);

			const relatedAnime = await ctx.db
				.select({ id: schema.anime.id, malId: schema.anime.malAnimeId })
				.from(schema.anime)
				.where(orm.inArray(schema.anime.malAnimeId, malIds));

			return {
				...metadata,
				relatedAnime: metadata.relatedAnime.map((anime) => {
					const dbAnime = relatedAnime.find(
						(dbAnime) => dbAnime.malId === anime.node.id,
					);

					return {
						...anime,
						id: dbAnime?.id ?? null,
					};
				}),
			};
		}),

	getCurrentSeasonAnimes: publicProcedure.query(async ({ ctx }) => {
		const currentSeasonAnime = await getCurrentAnimeSeason().then(({ data }) =>
			data.filter((data) => data.mal_id !== undefined).slice(0, 10),
		);

		const animes = await ctx.db
			.select()
			.from(schema.anime)
			.where(
				orm.inArray(
					schema.anime.malAnimeId,
					currentSeasonAnime.map((anime) => anime.mal_id) as number[],
				),
			);

		return currentSeasonAnime.map((anime) => ({
			...anime,
			anime: animes.find((dbAnime) => dbAnime.malAnimeId === anime.mal_id),
		}));
	}),

	search: publicProcedure
		.input(
			z.object({
				query: z.string(),
				limit: z.number().default(3),
				page: z
					.number()
					.default(1)
					.transform((value) => (value < 1 ? 1 : value)),
			}),
		)
		.query(async ({ input }) => {
			return await searchAnimeFromMyAnimeList(
				input.query,
				input.page,
				input.limit,
			);
		}),

	addToMyList: protectedProcedure
		.input(z.object({ malId: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const { accessToken } = ctx.session;

			return await addToAnimeList(accessToken, input.malId);
		}),

	updateAnimeInMyList: protectedProcedure
		.input(
			z.object({
				malId: z.number(),
				status: z.enum(watchStatus).exclude(["all"]),
				numWatchedEpisodes: z.number(),
				score: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { accessToken } = ctx.session;

			return await updateAnimeList(
				accessToken,
				input.malId,
				input.status,
				input.numWatchedEpisodes,
				input.score,
			);
		}),

	deleteFromMyList: protectedProcedure
		.input(z.object({ malId: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const { accessToken } = ctx.session;

			return await deleteFromAnimeList(accessToken, input.malId);
		}),
});
