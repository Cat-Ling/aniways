import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  getRecentlyReleasedAnime,
  db,
  schema,
  orm,
} from '@aniways/data-access';
import { createId } from '@paralleldrive/cuid2';
import { parse } from 'node-html-parser';

const { anime, video, animeGenre } = schema;
const { eq } = orm;

const logger = (...args: any[]) => {
  console.log('[Aniways]', '{cron}', ...args);
};

const fetchAnimeDetailsFromAnitaku = async (slug: string) => {
  return await fetch(`https://anitaku.to/category/${slug}`)
    .then(res => res.text())
    .then(html => parse(html))
    .then(dom => {
      const title = dom
        .querySelector('.anime_info_body_bg h1')
        ?.innerText.trim();
      const image = dom
        .querySelector('.anime_info_body_bg img')
        ?.getAttribute('src');
      const released = dom
        .querySelectorAll('.type')
        .map(a =>
          a.innerText.includes('Released') ?
            a.innerText.replace('Released: ', '').trim()
          : null
        )
        .filter(year => year !== null)
        .at(0);
      const status = dom
        .querySelectorAll('.type')
        .map(a =>
          a.innerText.includes('Status') ?
            a.innerText.replace('Status: ', '').trim()
          : null
        )
        .filter(status => status !== null)
        .at(0);
      const description = dom
        .querySelectorAll('.type')
        .map(a =>
          a.innerText.includes('Plot Summary') ?
            a.innerText.replace('Plot Summary: ', '').trim()
          : null
        )
        .filter(status => status !== null)
        .at(0);
      const genres = dom
        .querySelectorAll('.type')
        .map(a =>
          a.innerText.includes('Genre') ?
            a.innerText.replace('Genre: ', '').trim()
          : null
        )
        .filter(status => status !== null)
        .at(0);
      return {
        title,
        image,
        released,
        status,
        description,
        genres,
      };
    });
};

const getSlug = async (url: string) => {
  const response = await fetch(url).then(res => res.text());
  const dom = parse(response);
  const slug = dom
    .querySelector('.anime-info a')
    ?.getAttribute('href')
    ?.split('/')
    .pop();
  return slug || null;
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
    ...(await getRecentlyReleasedAnime(1)).anime,
    ...(await getRecentlyReleasedAnime(2)).anime,
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
    a =>
      lastUpdatedAnimes.find(
        l =>
          (l.slug === a.slug && l.lastEpisode === String(a.episode)) ||
          (a.slug === l.videos[0]?.slug.split('-episode-').shift() &&
            l.videos[0]?.episode === String(a.episode))
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
          (await getSlug(
            `https://anitaku.to/${a.slug}-episode-${a.episode}`
          )) || a.slug;
        const animeFromDb = allAnimes.find(anime => anime.slug === slug);
        let animeId = animeFromDb?.id;
        if (!animeFromDb) {
          logger('No anime found in db, fetching from anitaku', a.slug);
          const animedata = await fetchAnimeDetailsFromAnitaku(slug);
          logger('Fetched anime details from anitaku', animedata);
          if (
            !animedata ||
            !animedata.title ||
            !animedata.image ||
            !animedata.released ||
            !animedata.status ||
            !animedata.genres
          ) {
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
                year: animedata.released,
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
