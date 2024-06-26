import { addToAnimeList } from "@aniways/myanimelist";

export async function addToMAL(accessToken: string, malId: number) {
  return await addToAnimeList(accessToken, malId);
}
