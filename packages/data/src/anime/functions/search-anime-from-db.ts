import { db, orm, schema } from '@aniways/database';

export async function searchAnimeFromDB(query: string, page: number) {
  const animes = await db
    .select({
      id: schema.anime.id,
      title: schema.anime.title,
      image: schema.anime.image,
      lastEpisode: schema.anime.lastEpisode,
    })
    .from(schema.anime)
    .where(
      orm.and(
        orm.sql`SIMILARITY(${schema.anime.title}, ${query}) > 0.2`,
        orm.notLike(schema.anime.title, '%Dub%'),
        orm.notLike(schema.anime.title, '%dub%'),
        orm.isNotNull(schema.anime.lastEpisode)
      )
    )
    .orderBy(orm.sql`SIMILARITY(${schema.anime.title}, ${query}) DESC`)
    .limit(21)
    .offset((page - 1) * 20);

  const hasNext = animes.length > 20;

  if (hasNext) {
    animes.pop();
  }

  return {
    animes,
    hasNext,
  };
}
