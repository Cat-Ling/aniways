import { db, orm, schema } from "@aniways/db";

export async function getRecentlyReleasedAnime(page: number) {
  const recentlyReleased = await db
    .select({
      id: schema.anime.id,
      title: schema.anime.title,
      image: schema.anime.image,
      lastEpisode: schema.anime.lastEpisode,
    })
    .from(schema.anime)
    .where(
      orm.and(
        orm.notLike(schema.anime.title, "%Dub%"),
        orm.notLike(schema.anime.title, "%dub%"),
        orm.isNotNull(schema.anime.lastEpisode),
      ),
    )
    .orderBy(orm.desc(schema.anime.updatedAt))
    .limit(21)
    .offset((page - 1) * 20);

  const hasNext = recentlyReleased.length > 20;

  if (hasNext) {
    recentlyReleased.pop();
  }

  return {
    recentlyReleased,
    hasNext,
  };
}
