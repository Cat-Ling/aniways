import { db, orm, schema } from '@aniways/db';
import { getCurrentAnimeSeason } from '@aniways/myanimelist';

export type CurrentAnimeSeason = Awaited<
  ReturnType<typeof getCurrentAnimeSeason>
>['data'][number] & {
  anime?: schema.Anime;
};

export async function getCurrentSeasonAnimes(): Promise<CurrentAnimeSeason[]> {
  const currentSeasonAnime = await getCurrentAnimeSeason().then(({ data }) =>
    data.slice(0, 10)
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
