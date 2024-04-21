import { deleteFromAnimeList } from '@aniways/myanimelist';
import { getAnimeMetadataFromMALById } from './get-anime-metadata-from-mal-by-id';

type AnimeMetadata = ReturnType<typeof getAnimeMetadataFromMALById>;

export async function deleteFromMAL(
  accessToken: string,
  malId: number
): AnimeMetadata {
  await deleteFromAnimeList(accessToken, malId);

  return await getAnimeMetadataFromMALById(accessToken, malId);
}
