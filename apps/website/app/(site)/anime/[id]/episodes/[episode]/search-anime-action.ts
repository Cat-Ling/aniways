'use server';

import { searchAnimeFromMyAnimeList } from '@aniways/myanimelist';

export const searchAnimeAction = async (query: string, page: number) => {
  return await searchAnimeFromMyAnimeList(query, page, 3).then(data => {
    console.log('searchAnimeAction', data.data.length);
    return data;
  });
};
