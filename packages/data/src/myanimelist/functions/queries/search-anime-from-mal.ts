import {
  searchAnimeFromMyAnimeList,
  SearchResults,
} from '@aniways/myanimelist';

export async function searchAnimeFromMAL(
  query: string,
  page: number,
  limit: number = 3
): Promise<SearchResults> {
  return await searchAnimeFromMyAnimeList(query, page, limit);
}
