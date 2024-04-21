'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@aniways/myanimelist';
import { cookies } from 'next/headers';
import { updateAnimeMetadata } from '@aniways/data';

export const updateMalAnimeAction = async (id: string, malId: number) => {
  const user = await auth(cookies());

  const details = await updateAnimeMetadata(user?.accessToken, id, malId).catch(
    err => {
      if (err === updateAnimeMetadata.NOT_FOUND) return null;
      throw err;
    }
  );

  revalidatePath(`/anime/${id}`, 'layout');

  return details;
};
