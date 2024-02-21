'use server';

import { getUser } from '@animelist/auth-next/server';
import { addToAnimeList } from '@aniways/myanimelist';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const addToListAction = async (malId: number) => {
  try {
    const user = await getUser(cookies());

    if (!user) {
      throw new Error('Must be logged in to add to list');
    }

    await addToAnimeList(user.accessToken, malId);

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);

    const error = e instanceof Error ? e : new Error('Failed to add to list');

    return {
      error: error.message,
    };
  }
};
