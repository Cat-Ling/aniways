'use server';

import { searchAnimeFromMAL } from '@aniways/data';

export const searchAnimeAction = async (query: string, page: number) => {
  return await searchAnimeFromMAL(query, page);
};
