import { updateAnimeList } from '@aniways/myanimelist';
import { getAnimeMetadataFromMALById } from './get-anime-metadata-from-mal-by-id';

type UpdateAnimeInMALArguments = Parameters<typeof updateAnimeList>;

type AnimeMetadata = ReturnType<typeof getAnimeMetadataFromMALById>;

export async function updateAnimeInMAL(
  ...args: UpdateAnimeInMALArguments
): AnimeMetadata {
  const [accessToken, malId, ...parameters] = args;

  await updateAnimeList(accessToken, malId, ...parameters);

  return await getAnimeMetadataFromMALById(accessToken, malId);
}
