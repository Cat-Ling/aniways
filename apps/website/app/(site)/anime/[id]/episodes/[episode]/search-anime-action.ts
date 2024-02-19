'use server';

import { searchAnimeFromMyAnimeList } from '@aniways/myanimelist';

export const searchAnimeAction = async (query: string, page: number) => {
  return await searchAnimeFromMyAnimeList(query, page, 3);
};
