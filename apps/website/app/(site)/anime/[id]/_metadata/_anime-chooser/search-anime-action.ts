'use server';

import { searchAnimeFromMAL } from '@aniways/data';

type SearchResults = ReturnType<typeof searchAnimeFromMAL>;

export const searchAnimeAction = async (
  query: string,
  page: number
): SearchResults => {
  return await searchAnimeFromMAL(query, page);
};
