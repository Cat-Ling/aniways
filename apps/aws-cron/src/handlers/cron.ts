import { orm, schema, db, createId, client } from '@aniways/database';
import {
  scrapeRecentlyReleasedAnime,
  scrapeSlugFromEpisodeSlug,
} from '@aniways/web-scraping';

const logger = {
  log(...args: any[]) {
    console.log('[Aniways]', '{cron}', ...args);
  },
};

const checkIfOffline = () => {
  // eslint-disable-next-line
  if (process.env.IS_OFFLINE) {
    logger.log('Offline mode');
    return true;
  }
  return false;
};

const getRecentlyReleasedAnimes = async () => {
  return (
    await Promise.all([
      scrapeRecentlyReleasedAnime(1).then(data => data.anime),
      scrapeRecentlyReleasedAnime(2).then(data => data.anime),
    ])
  )
    .reduce((acc, val) => acc.concat(val), [])
    .reverse()
    .map(a => ({
      ...a,
      slug: a.url.replace('/anime/', '').split('/')[0]!,
    }));
};

const filterNewAnimes = async (
  recentlyReleasedAnimes: Awaited<ReturnType<typeof getRecentlyReleasedAnimes>>
) => {
  logger.log('Started fetching last updated animes from db');

  const lastUpdatedAnimes = await db.query.anime.findMany({
    columns: {
      id: true,
      slug: true,
      lastEpisode: true,
    },
    orderBy: ({ updatedAt }, { desc }) => desc(updatedAt),
    limit: 60,
    with: {
      videos: {
        columns: {
          slug: true,
        },
        limit: 1,
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
      },
    },
  });

  logger.log('Fetched last updated animes from db', lastUpdatedAnimes.length);

  return recentlyReleasedAnimes.filter(a => {
    const animeFromDB = lastUpdatedAnimes.find(
      anime =>
        anime.slug === a.slug ||
        anime.videos[0]?.slug.split('-episode-')[0] === a.slug
    );

    return !animeFromDB || animeFromDB.lastEpisode !== String(a.episode);
  });
};

const constructIndividualInsertValues = async (
  newAnime: Awaited<ReturnType<typeof filterNewAnimes>>[number]
) => {
  const episodeSlug = `${newAnime.slug}-episode-${newAnime.episode}`;

  const slug = await scrapeSlugFromEpisodeSlug(episodeSlug).then(
    scrapedSlug => scrapedSlug || newAnime.slug
  );

  const [anime] = await db
    .select({
      id: schema.anime.id,
      lastEpisode: schema.anime.lastEpisode,
    })
    .from(schema.anime)
    .where(orm.eq(schema.anime.slug, slug));

  const animeId = anime?.id ?? createId();

  if (!anime) {
    logger.log('No anime found in db, fetching from anitaku', newAnime.slug);

    await db.insert(schema.anime).values({
      id: animeId,
      title: newAnime.name,
      image: newAnime.image,
      slug: slug,
      lastEpisode: String(newAnime.episode),
      updatedAt: new Date(),
    });

    logger.log('Inserted new anime', newAnime.name, 'into db');
  }

  await db
    .update(schema.anime)
    .set({
      lastEpisode: String(newAnime.episode),
      updatedAt: new Date(),
    })
    .where(orm.eq(schema.anime.id, animeId));

  const lastEpisodeSaved = Number(anime?.lastEpisode ?? '0');

  const numberOfEpisodesToInsert = newAnime.episode - lastEpisodeSaved;

  const episodes = Array.from({ length: numberOfEpisodesToInsert })
    .map((_, i) => newAnime.episode - i)
    .reverse();

  episodes.pop(); // Remove the last episode

  return [
    ...episodes.map(ep => ({
      id: createId(),
      animeId: animeId!,
      episode: String(ep),
      slug: `${newAnime.slug}-episode-${ep}`,
      createdAt: new Date(),
    })),
    {
      id: createId(),
      animeId: animeId!,
      episode: String(newAnime.episode),
      slug: `${newAnime.slug}-episode-${newAnime.episode.toString().replace('.', '-')}`,
      createdAt: new Date(),
    },
  ];
};

const constructInsertValues = async (
  newAnimes: Awaited<ReturnType<typeof filterNewAnimes>>
) => {
  const insertValues = await Promise.all(
    newAnimes.map(constructIndividualInsertValues)
  );

  return insertValues.flat();
};

export const main = async () => {
  if (checkIfOffline()) throw new Error('Offline mode');

  logger.log('Started fetching recently released anime from anitaku');

  const recentlyReleasedAnime = await getRecentlyReleasedAnimes();

  logger.log(
    'Fetched recently released anime from anitaku',
    recentlyReleasedAnime.length
  );

  logger.log('Started filtering new animes');

  const newAnimes = await filterNewAnimes(recentlyReleasedAnime);

  logger.log('New anime episodes', newAnimes);

  if (newAnimes.length === 0) {
    return logger.log('No new animes');
  }

  const insertValues = await constructInsertValues(newAnimes);

  if (insertValues.length === 0) {
    return logger.log('No new episodes to insert');
  }

  await db.insert(schema.video).values(insertValues);

  logger.log('Inserted', insertValues.length, 'new episodes into db');

  await client.end(); // Close the connection

  logger.log('Connection closed');
};
