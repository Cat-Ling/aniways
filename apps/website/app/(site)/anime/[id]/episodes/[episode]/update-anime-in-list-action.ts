'use server';

import { getUser } from '@animelist/auth-next/server';
import { updateAnimeList } from '@myanimelist/anime-list';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const updateAnimeInListAction = async (
  malId: number,
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch',
  episodesWatched: number,
  score: number
) => {
  try {
    const user = await getUser(cookies());

    if (!user) {
      throw new Error('Must be logged in to update list');
    }

    await updateAnimeList(
      user.accessToken,
      malId,
      status,
      episodesWatched,
      score
    );

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);

    const error = e instanceof Error ? e : new Error('Failed to update list');

    return {
      error: error.message,
    };
  }
};
