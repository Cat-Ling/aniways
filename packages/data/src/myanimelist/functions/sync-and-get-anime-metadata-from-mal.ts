import { db, orm, schema } from '@aniways/database';
import {
  getAnimeMetadataFromMAL,
  GetAnimeMetadataOptions,
} from './get-anime-metadata-from-mal';
import { syncAnimeMetadataFromMAL } from './sync-anime-metadata-from-mal';

const NOT_FOUND = 'not-found' as const;

async function _syncAndGetAnimeMetadataFromMAL(
  accessToken: string | undefined,
  anime: schema.Anime
) {
  const options: GetAnimeMetadataOptions =
    anime.malAnimeId ?
      {
        malId: anime.malAnimeId,
      }
    : {
        title: anime.title,
      };

  const details = await getAnimeMetadataFromMAL(accessToken, options);

  if (!anime.malAnimeId && details?.mal_id) {
    await syncAnimeMetadataFromMAL(
      accessToken,
      anime.id,
      details.mal_id,
      false
    );
  }

  if (!details || !details.mal_id) throw NOT_FOUND;

  return details;
}

export const syncAndGetAnimeMetadataFromMAL = Object.assign(
  _syncAndGetAnimeMetadataFromMAL,
  {
    NOT_FOUND,
  }
);
