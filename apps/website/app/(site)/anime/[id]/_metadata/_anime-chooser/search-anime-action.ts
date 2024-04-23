'use server';

import { createMyAnimeListService } from '@aniways/data';

export const searchAnimeAction = async (query: string, page: number) => {
  const { searchAnimeOnMyAnimeList } = createMyAnimeListService();

  return await searchAnimeOnMyAnimeList(query, page);
};
