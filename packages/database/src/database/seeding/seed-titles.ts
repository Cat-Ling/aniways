import { chunk } from 'lodash';
import db, { schema } from '..';
import { createId } from '@paralleldrive/cuid2';

async function main() {
  const anime = await db.query.anime.findMany();
  await Promise.all(
    chunk(anime, 1000).map(async chunk => {
      await db.insert(schema.animeTitle).values(
        chunk.map(a => ({
          id: createId(),
          animeId: a.id,
          title: a.title,
        }))
      );
    })
  );
}

export const seed = main;
