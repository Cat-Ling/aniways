import { db, orm, schema } from '@aniways/database';
import { getAnimeDetailsFromMyAnimeList } from '@aniways/myanimelist';

export type AnimeMetadata = Exclude<
  Awaited<ReturnType<typeof getAnimeDetailsFromMyAnimeList>>,
  null | undefined
>;

const NOT_FOUND = 'not-found' as const;

async function _getAnimeMetadataFromMAL(
  accessToken: string | undefined,
  anime: schema.Anime
): Promise<AnimeMetadata> {
  const details = await getAnimeDetailsFromMyAnimeList({
    accessToken: accessToken,
    ...(anime.malAnimeId ?
      { malId: anime.malAnimeId }
    : { title: anime.title }),
  });

  if (!anime.malAnimeId && details?.mal_id) {
    await db
      .update(schema.anime)
      .set({ malAnimeId: details.mal_id })
      .where(orm.eq(schema.anime.id, anime.id));
  }

  if (!details || !details.mal_id) throw NOT_FOUND;

  return details;
}

export const getAnimeMetadataFromMAL = Object.assign(_getAnimeMetadataFromMAL, {
  NOT_FOUND,
});
