import db from '../../database';

export default async function searchFromDB(query: string, page: number) {
  const animes = await db.query.anime.findMany({
    where: ({ title }, { sql }) => {
      return sql`SIMILARITY(${title}, ${query}) > 0.2 AND ${title} NOT LIKE '%Dub%' AND ${title} NOT LIKE '%dub%'`;
    },
    orderBy: ({ title }, { sql }) => {
      return sql`SIMILARITY(${title}, ${query}) DESC`;
    },
    limit: 21,
    offset: (page - 1) * 20,
    with: {
      genres: true,
    },
  });

  const hasNext = animes.length > 20;

  if (hasNext) {
    animes.pop();
  }

  return {
    animes: animes.map(anime => ({
      ...anime,
      url: `/anime/${anime.slug}`,
    })),
    hasNext,
  };
}
