import { deleteFromAnimeList } from '@aniways/myanimelist';
import { getAnimeMetadataFromMAL } from '../queries';

export async function deleteFromMAL(accessToken: string, malId: number) {
  await deleteFromAnimeList(accessToken, malId);

  return await getAnimeMetadataFromMAL(accessToken, { malId });
}
