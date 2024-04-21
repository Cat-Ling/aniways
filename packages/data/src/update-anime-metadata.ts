import { db, orm, schema } from '@aniways/database';
import { getAnimeMetadataFromMAL } from './get-anime-metadata-from-mal';

const NOT_FOUND = 'not-found' as const;

async function _updateAnimeMetadata(
  accessToken: string | undefined,
  id: string,
  malId: number
): ReturnType<typeof getAnimeMetadataFromMAL> {
  const anime = await db
    .update(schema.anime)
    .set({
      malAnimeId: malId,
    })
    .where(orm.eq(schema.anime.id, id))
    .returning()
    .then(([data]) => data);

  if (!anime) throw NOT_FOUND;

  return await getAnimeMetadataFromMAL(accessToken, anime);
}

export const updateAnimeMetadata = Object.assign(_updateAnimeMetadata, {
  NOT_FOUND,
});
