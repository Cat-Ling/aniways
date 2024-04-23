import { db, orm, schema } from '@aniways/database';
import { getAnimeMetadataFromMAL } from '../queries';

const NOT_FOUND = 'not-found' as const;

async function _syncAnimeMetadataFromMAL(
  accessToken: string | undefined,
  id: string,
  malId: number,
  returning: boolean = true
) {
  const anime = await db
    .update(schema.anime)
    .set({
      malAnimeId: malId,
    })
    .where(orm.eq(schema.anime.id, id))
    .returning()
    .then(([data]) => data);

  if (!anime) throw NOT_FOUND;

  if (!returning) return;

  return await getAnimeMetadataFromMAL(accessToken, anime);
}

export const syncAnimeMetadataFromMAL = Object.assign(
  _syncAnimeMetadataFromMAL,
  {
    NOT_FOUND,
  }
);
