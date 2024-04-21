import { addToAnimeList } from '@aniways/myanimelist';
import { getAnimeMetadataFromMALById } from './get-anime-metadata-from-mal-by-id';

type AnimeMetadata = ReturnType<typeof getAnimeMetadataFromMALById>;

export async function addToMAL(
  accessToken: string,
  malId: number
): AnimeMetadata {
  await addToAnimeList(accessToken, malId);

  return await getAnimeMetadataFromMALById(accessToken, malId);
}
