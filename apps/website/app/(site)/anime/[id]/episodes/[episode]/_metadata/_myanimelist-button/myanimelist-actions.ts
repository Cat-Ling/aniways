'use server';

import { auth } from '@aniways/myanimelist';
import {
  addToAnimeList,
  deleteFromAnimeList,
  updateAnimeList,
} from '@aniways/myanimelist';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const addToListAction = async (malId: number) => {
  try {
    const user = await auth(cookies());

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

export const deleteAnimeInListAction = async (malId: number) => {
  try {
    const user = await auth(cookies());

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

export const updateAnimeInListAction = async (
  malId: number,
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch',
  episodesWatched: number,
  score: number
) => {
  try {
    const user = await auth(cookies());

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
