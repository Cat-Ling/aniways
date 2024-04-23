'use server';

import { auth } from '@aniways/auth';
import { MyAnimeListService, createMyAnimeListService } from '@aniways/data';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const updateMalAnimeAction = async (id: string, malId: number) => {
  const user = await auth(cookies());

  const { syncAnimeMetadataFromMyAnimeList } = createMyAnimeListService(
    user?.accessToken
  );

  const details = await syncAnimeMetadataFromMyAnimeList(id, malId).catch(
    err => {
      if (err === MyAnimeListService.NOT_FOUND) return null;
      throw err;
    }
  );

  revalidatePath(`/anime/${id}`, 'layout');

  return details;
};
