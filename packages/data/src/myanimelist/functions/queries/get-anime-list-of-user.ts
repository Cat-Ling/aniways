import { db, orm, schema } from "@aniways/db";
import { getAnimeList } from "@aniways/myanimelist";

export type Status =
	| "watching"
	| "completed"
	| "on_hold"
	| "dropped"
	| "plan_to_watch"
	| "all";

interface AnimeList {
	anime: (Awaited<ReturnType<typeof getAnimeList>>["data"][number]["node"] & {
		dbAnime?: schema.Anime;
	})[];
	hasNext: boolean;
}

export async function getAnimeListOfUser(
	accessToken: string,
	username: string,
	page: number,
	status: Status,
): Promise<AnimeList> {
	const animeList = await getAnimeList(
		accessToken,
		username,
		page,
		20,
		status !== "all" ? status : undefined,
	);

	if (!animeList.data.length)
		return {
			anime: [],
			hasNext: false,
		};

	const dbAnimes = await db
		.select()
		.from(schema.anime)
		.where(
			orm.inArray(
				schema.anime.malAnimeId,
				animeList.data.map(({ node: anime }) => anime.id),
			),
		);

	const animeMap = dbAnimes.reduce(
		(acc, anime) => {
			if (!anime.malAnimeId) return acc;
			acc[anime.malAnimeId] = anime;
			return acc;
		},
		{} as Record<number, schema.Anime>,
	);

	return {
		anime: animeList.data.map((anime) => {
			const dbAnime = animeMap[anime.node.id];

			return {
				...anime.node,
				dbAnime: dbAnime,
			};
		}),
		hasNext: !!animeList.paging.next,
	};
}
