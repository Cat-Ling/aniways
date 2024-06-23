/* eslint-disable @typescript-eslint/only-throw-error */
import type { GetAnimeMetadataOptions } from "./queries/get-anime-metadata-from-mal";
import { syncAnimeMetadataFromMAL } from "./mutations/sync-anime-metadata-from-mal";
import { getAnimeMetadataFromMAL } from "./queries/get-anime-metadata-from-mal";

const NOT_FOUND = "not-found";

async function _syncAndGetAnimeMetadataFromMAL(
  accessToken: string | undefined,
  anime: {
    id: string;
    title: string;
    malAnimeId: number | null;
  },
) {
  const options: GetAnimeMetadataOptions = anime.malAnimeId
    ? {
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
      false,
    );
  }

  if (!details || !details.mal_id) throw NOT_FOUND;

  console.log("details =====>", details);

  return details;
}

export const syncAndGetAnimeMetadataFromMAL = Object.assign(
  _syncAndGetAnimeMetadataFromMAL,
  {
    NOT_FOUND,
  },
);
