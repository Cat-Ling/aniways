'use server';

import { getUser } from '@animelist/auth-next/server';
import { deleteFromAnimeList } from '@myanimelist/anime-list';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const deleteAnimeInListAction = async (malId: number) => {
  try {
    const user = await getUser(cookies());

    if (!user) {
      throw new Error('Must be logged in to delete from list');
    }

    await deleteFromAnimeList(user.accessToken, malId);

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);

    const error =
      e instanceof Error ? e : new Error('Failed to delete from list');

    return {
      error: error.message,
    };
  }
};
