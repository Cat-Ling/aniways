import { APIGatewayProxyHandler } from 'aws-lambda';
import { orm, schema, db, createId } from '@aniways/database';
import {
  scrapeRecentlyReleasedAnime,
  scrapeSlugFromEpisodeSlug,
  scrapeDetailsOfAnime,
} from '@aniways/web-scraping';

const { anime, video, animeGenre } = schema;
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

  const lastUpdatedAnimes = await db.query.anime
    .findMany({
      orderBy: ({ updatedAt }, { desc }) => desc(updatedAt),
      limit: 100,
      with: {
        videos: {
          limit: 1,
          orderBy: ({ createdAt }, { desc }) => desc(createdAt),
        },
      },
    })
    .execute();

  logger('Fetched last updated animes from db', lastUpdatedAnimes.length);

  logger('Started fetching recently released anime from anitaku');

  const recentlyReleasedAnime = [
    ...(await scrapeRecentlyReleasedAnime(1)).anime,
    ...(await scrapeRecentlyReleasedAnime(2)).anime,
  ]
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

  const newAnimes = recentlyReleasedAnime.filter(
    scrapedAnime =>
      lastUpdatedAnimes.find(
        dbAnime =>
          (dbAnime.slug === scrapedAnime.slug &&
            dbAnime.lastEpisode !== String(scrapedAnime.episode)) ||
          (dbAnime.videos[0]?.slug !==
            `${scrapedAnime.slug}-episode-${scrapedAnime.episode}` &&
            dbAnime.videos[0]?.slug.split('-episode-')[1] !==
              String(scrapedAnime.episode))
      ) === undefined
  );

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

  logger('Started fetching animes from DB');

  const allAnimes = await db.query.anime.findMany();

  logger('Fetched', allAnimes.length, 'animes from db');

  logger('Started inserting new episodes');

  const insertValues = (
    await Promise.all(
      newAnimes.map(async a => {
        const slug =
          (await scrapeSlugFromEpisodeSlug(`${a.slug}-episode-${a.episode}`)) ||
          a.slug;

        const animeFromDb = allAnimes.find(anime => anime.slug === slug);
        let animeId = animeFromDb?.id;

        if (!animeFromDb) {
          logger('No anime found in db, fetching from anitaku', a.slug);
          const animedata = await scrapeDetailsOfAnime(slug);
          logger('Fetched anime details from anitaku', animedata);

          if (!animedata) {
            return Promise.resolve(undefined);
          }

          animeId = createId();

          await db
            .insert(anime)
            .values([
              {
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
                    anime.status as unknown as
                      | 'Upcoming'
                      | 'Ongoing'
                      | 'Completed'
                  ]! as any) ?? 'NOT_YET_AIRED',
                lastEpisode: String(a.episode),
                updatedAt: new Date(),
              },
            ])
            .execute();
          logger('Inserted new anime', animedata.title, 'into db');
          if (animedata.genres) {
            await db
              .insert(animeGenre)
              .values(
                animedata.genres.split(',').map((genre: string) => ({
                  id: createId(),
                  animeId: animeId!,
                  genre: genre.trim(),
                }))
              )
              .execute();
          }
          logger('Inserted genres for', animedata.title);
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

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Inserted new animes',
      newAnimes: insertValues,
    }),
  };
};
