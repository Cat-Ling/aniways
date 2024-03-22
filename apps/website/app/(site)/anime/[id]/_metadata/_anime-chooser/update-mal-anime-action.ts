'use server';

import { db, orm, schema } from '@aniways/database';
import { revalidatePath } from 'next/cache';
import { auth } from '@aniways/myanimelist';
import { getAnimeDetailsFromMyAnimeList } from '@aniways/myanimelist';
import { cookies } from 'next/headers';

export const updateMalAnimeAction = async (id: string, malId: number) => {
  const user = await auth(cookies());

  const anime = await db
    .update(schema.anime)
    .set({
      malAnimeId: malId,
    })
    .where(orm.eq(schema.anime.id, id))
    .returning()
    .then(data => data[0]);

  const details = await getAnimeDetailsFromMyAnimeList({
    accessToken: user?.accessToken,
    ...(anime.malAnimeId ?
      { malId: anime.malAnimeId }
    : { title: anime.title }),
  });

  revalidatePath(`/anime/${id}`, 'layout');

  return details;
};
