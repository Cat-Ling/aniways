import { APIGatewayProxyHandler } from 'aws-lambda';
import { orm, schema, db, createId, client } from '@aniways/database';
import {
  scrapeRecentlyReleasedAnime,
  scrapeSlugFromEpisodeSlug,
  scrapeDetailsOfAnime,
} from '@aniways/web-scraping';

const { anime, video } = schema;
const { eq } = orm;

const logger = (...args: any[]) => {
  console.log('[Aniways]', '{cron}', ...args);
};

export const main: APIGatewayProxyHandler = async event => {
  // eslint-disable-next-line
  if (process.env.IS_OFFLINE && !event?.httpMethod) {
    logger('Offline mode');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Offline mode',
      }),
    };
  }

  logger('Started fetching last updated animes from db');

  const lastUpdatedAnimes = await db.query.anime.findMany({
    columns: {
      id: true,
      slug: true,
      lastEpisode: true,
    },
    orderBy: ({ updatedAt }, { desc }) => desc(updatedAt),
    limit: 50,
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

  logger('Fetched last updated animes from db', lastUpdatedAnimes.length);

  logger('Started fetching recently released anime from anitaku');

  const recentlyReleasedAnime = (
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

  logger(
    'Fetched recently released anime from anitaku',
    recentlyReleasedAnime.length
  );

  logger('Started filtering new animes');

  const newAnimes = recentlyReleasedAnime.filter(a => {
    const animeFromDB = lastUpdatedAnimes.find(
      anime =>
        anime.slug === a.slug ||
        anime.videos[0]?.slug.split('-episode-')[0] === a.slug
    );
    if (!animeFromDB) return true;
    if (animeFromDB.lastEpisode === String(a.episode)) return false;
    return true;
  });

  logger('New anime episodes', newAnimes);

  if (newAnimes.length === 0) {
    logger('No new animes');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'No new animes',
      }),
    };
  }

  logger('Started inserting new episodes');

  const insertValues = (
    await Promise.all(
      newAnimes.map(async a => {
        const slug =
          (await scrapeSlugFromEpisodeSlug(`${a.slug}-episode-${a.episode}`)) ||
          a.slug;

        const animeFromDb = await db
          .select({
            id: anime.id,
            lastEpisode: anime.lastEpisode,
          })
          .from(anime)
          .where(eq(anime.slug, slug))
          .then(data => data[0]);

        let animeId = animeFromDb?.id;

        if (!animeFromDb) {
          logger('No anime found in db, fetching from anitaku', a.slug);
          const animedata = await scrapeDetailsOfAnime(slug);
          logger('Fetched anime details from anitaku', animedata);

          if (!animedata) {
            return Promise.resolve(undefined);
          }

          animeId = createId();

          await db.insert(anime).values({
            id: animeId,
            title: animedata.title,
            image: animedata.image,
            year: animedata.released ?? '',
            description: animedata.description ?? '',
            slug: slug,
            status:
              ({
                Upcoming: 'NOT_YET_AIRED',
                Ongoing: 'CURRENTLY_AIRING',
                Completed: 'FINISHED_AIRING',
              }[
                anime.status as unknown as 'Upcoming' | 'Ongoing' | 'Completed'
              ]! as any) ?? 'NOT_YET_AIRED',
            lastEpisode: String(a.episode),
            updatedAt: new Date(),
          });

          logger('Inserted new anime', animedata.title, 'into db');
        }
        await db
          .update(anime)
          .set({
            lastEpisode: String(a.episode),
            updatedAt: new Date(),
          })
          .where(eq(anime.id, animeId!))
          .execute();
        const episodes = Array.from({
          length:
            a.episode < 1 ?
              1
            : a.episode - Number(animeFromDb?.lastEpisode ?? '0'),
        })
          .map((_, i) => a.episode - i)
          .reverse();
        return episodes.map(ep => ({
          id: createId(),
          animeId: animeId!,
          episode: String(ep),
          slug: `${a.slug}-episode-${ep}`,
          createdAt: new Date(),
        }));
      })
    )
  )
    .flat()
    .filter(val => val !== undefined) as {
    id: string;
    animeId: string;
    episode: string;
    slug: string;
    createdAt: Date;
  }[];

  if (insertValues.length === 0) {
    logger('No new episodes to insert');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'No new episodes to insert',
      }),
    };
  }

  await db.insert(video).values(insertValues).execute();
  logger('Inserted', insertValues.length, 'new episodes into db');

  await client.end(); // Close the connection

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Inserted new animes',
      newAnimes: insertValues,
    }),
  };
};
