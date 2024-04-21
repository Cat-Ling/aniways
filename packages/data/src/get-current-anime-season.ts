import { getCurrentAnimeSeason as getCurrentSeason } from '@aniways/myanimelist';
import { db, schema, orm } from '@aniways/database';

export type CurrentSeasonAnime = Awaited<
  ReturnType<typeof getCurrentSeason>
>['data'][number] & {
  anime?: schema.Anime;
};

export async function getCurrentAnimeSeason(): Promise<CurrentSeasonAnime[]> {
  const currentSeasonAnime = await getCurrentSeason().then(({ data }) =>
    data.slice(0, 5)
  );

  const animes = await db
    .select()
    .from(schema.anime)
    .where(
      orm.inArray(
        schema.anime.malAnimeId,
        currentSeasonAnime.map(anime => anime.mal_id!)
      )
    );

  const animeMap = animes.reduce(
    (acc, anime) => {
      if (!anime.malAnimeId) return acc;
      acc[anime.malAnimeId] = anime;
      return acc;
    },
    {} as Record<number, (typeof animes)[number]>
  );

  return currentSeasonAnime.map(anime => ({
    ...anime,
    anime: animeMap[anime.mal_id!],
  }));
}
