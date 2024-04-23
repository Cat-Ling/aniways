import { addToAnimeList } from '@aniways/myanimelist';
import { getAnimeMetadataFromMAL } from '../queries';

export async function addToMAL(accessToken: string, malId: number) {
  await addToAnimeList(accessToken, malId);

  return await getAnimeMetadataFromMAL(accessToken, { malId });
}
