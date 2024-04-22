import { updateAnimeList } from '@aniways/myanimelist';
import { getAnimeMetadataFromMAL } from './get-anime-metadata-from-mal';

export type UpdateAnimeInMALArguments = Parameters<typeof updateAnimeList>;

export async function updateAnimeInMAL(...args: UpdateAnimeInMALArguments) {
  const [accessToken, malId, ...parameters] = args;

  await updateAnimeList(accessToken, malId, ...parameters);

  return await getAnimeMetadataFromMAL(accessToken, { malId });
}
