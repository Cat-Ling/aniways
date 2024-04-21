import { searchAnimeFromMyAnimeList } from '@aniways/myanimelist';

type SearchResults = ReturnType<typeof searchAnimeFromMyAnimeList>;

export async function searchAnimeFromMAL(
  query: string,
  page: number,
  limit: number = 3
): SearchResults {
  return await searchAnimeFromMyAnimeList(query, page, limit);
}
