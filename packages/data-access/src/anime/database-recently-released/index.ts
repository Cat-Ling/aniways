import db from '../../database';

export default async function getRecentlyReleasedFromDB(page: number) {
  const recentlyReleased = await db.query.anime.findMany({
    where: ({ title, lastEpisode }, { notLike, and, isNotNull }) => {
      return and(isNotNull(lastEpisode), notLike(title, `%dub%`));
    },
    orderBy: ({ updatedAt }, { desc }) => desc(updatedAt),
    offset: (page - 1) * 20,
    limit: 20,
    with: {
      videos: true,
    },
  });

  const hasNext = await db.query.anime
    .findMany({
      where: ({ title, lastEpisode }, { notLike, and, isNotNull, or }) => {
        return and(
          isNotNull(lastEpisode),
          or(notLike(title, `%dub%`), notLike(title, '%Dub%'))
        );
      },
      orderBy: ({ updatedAt }, { desc }) => desc(updatedAt),
      offset: page * 20,
      limit: 20,
    })
    .then(anime => anime.length > 0);

  return {
    recentlyReleased,
    hasNext,
  };
}
