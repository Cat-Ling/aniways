import { db, orm, schema } from '@aniways/database';

export async function getAnimeById(id: string) {
  return db
    .select()
    .from(schema.anime)
    .where(orm.eq(schema.anime.id, id))
    .then(([anime]) => anime);
}
