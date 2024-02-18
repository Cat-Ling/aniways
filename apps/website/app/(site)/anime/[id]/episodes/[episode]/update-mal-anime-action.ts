'use server';

import { db, orm, schema } from '@aniways/database';
import { revalidatePath } from 'next/cache';

export const updateMalAnimeAction = async (id: string, malId: number) => {
  await db
    .update(schema.anime)
    .set({
      malAnimeId: malId,
    })
    .where(orm.eq(schema.anime.id, id));

  revalidatePath('/', 'layout');
};
