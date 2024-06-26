import type { SearchResults } from "@aniways/myanimelist";
import { searchAnimeFromMyAnimeList } from "@aniways/myanimelist";

export async function searchAnimeFromMAL(
  query: string,
  page: number,
  limit = 3
): Promise<SearchResults> {
  return await searchAnimeFromMyAnimeList(query, page, limit);
}
