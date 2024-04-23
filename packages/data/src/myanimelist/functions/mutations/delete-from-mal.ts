import { deleteFromAnimeList } from '@aniways/myanimelist';

export async function deleteFromMAL(accessToken: string, malId: number) {
  return await deleteFromAnimeList(accessToken, malId);
}
