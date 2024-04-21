import { db, orm, schema } from '@aniways/database';

export async function getVideosByAnimeId(animeId: string) {
  return await db
    .selectDistinctOn([schema.video.episode])
    .from(schema.video)
    .where(orm.eq(schema.video.animeId, animeId))
    .orderBy(orm.asc(schema.video.episode));
}
