import db from '../../database';

export default async function searchFromDB(query: string, page: number) {
  const animes = await db.query.anime.findMany({
    where: ({ title }, { sql }) => {
      return sql`SIMILARITY(${title}, ${query}) > 0.2`;
    },
    orderBy: ({ title }, { sql }) => {
      return sql`SIMILARITY(${title}, ${query}) DESC`;
    },
    limit: 20,
    offset: (page - 1) * 20,
    with: {
      genres: true,
    },
  });
  const nextAnimes = await db.query.anime.findMany({
    where: ({ title }, { sql }) => {
      return sql`SIMILARITY(${title}, ${query}) > 0.2`;
    },
    orderBy: ({ title }, { sql }) => {
      return sql`SIMILARITY(${title}, ${query}) DESC`;
    },
    limit: 20,
    offset: page * 20,
  });
  return {
    animes: animes.map(anime => ({
      ...anime,
      url: `/anime/${anime.slug}`,
    })),
    hasNext: nextAnimes.length > 0,
  };
}
