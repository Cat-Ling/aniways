import { scrapeRecentlyReleasedAnime } from '@aniways/web-scraping';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { chunk } from 'lodash';
import { db, schema } from '..';

const { video, anime } = schema;

export const seedVideos = async () => {
  await db.delete(video).execute();
  console.log('Dropped video rows');

  console.log('Started fetching recently released anime');

  let length = 0;

  const fetchRecentlyReleased = async (
    page: number
  ): Promise<
    {
      slug: string;
      name: string;
      episode: number;
      image: string;
      url: string;
    }[]
  > => {
    const recentlyReleasedAnime = (
      await Promise.all(
        Array.from({ length: 50 }).map(async (_, i) => {
          const _page = page + i;
          const recentlyReleasedAnime = (
            await scrapeRecentlyReleasedAnime(_page)
          ).anime.map(a => ({
            ...a,
            slug: a.url.replace('/anime/', '').split('/')[0]!,
          }));
          return recentlyReleasedAnime;
        })
      )
    ).flat();
    length += recentlyReleasedAnime.length;
    console.log('Fetched', length, 'recently released animes');
    const nextPage = page + 50;

    if (recentlyReleasedAnime.length === 0) return [];

    return [
      ...recentlyReleasedAnime,
      ...(await fetchRecentlyReleased(nextPage)),
    ];
  };

  const recentlyReleasedAnime = (await fetchRecentlyReleased(1)).reverse();

  console.log(
    'Fetched',
    recentlyReleasedAnime.length,
    'Recently Released Animes'
  );

  console.log('Started fetching animes from DB');
  const allAnimes = await db.query.anime.findMany();
  console.log('Fetched', allAnimes.length, 'animes from db');

  const insertValues = (
    await Promise.all(
      chunk(recentlyReleasedAnime, 1000).map(async chunk => {
        return (
          await Promise.all(
            chunk.map(async a => {
              const animeFromDb = allAnimes.find(
                anime => anime.slug === a.slug
              );
              if (!animeFromDb) return Promise.resolve(undefined);
              await db
                .update(anime)
                .set({
                  lastEpisode: String(a.episode),
                  updatedAt: new Date(),
                })
                .where(eq(anime.id, animeFromDb.id))
                .execute();
              const episodes = Array.from({
                length: a.episode < 1 ? 1 : a.episode,
              })
                .map((_, i) => a.episode - i)
                .reverse();
              return episodes.map(ep => ({
                id: createId(),
                animeId: animeFromDb.id,
                episode: String(ep),
                slug: `${a.slug}-episode-${ep}`,
                createdAt: new Date(),
              }));
            })
          )
        ).flat();
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

  for (const c of chunk(insertValues, 1000)) {
    console.log('Inserting', c.length, 'Videos');
    await db.insert(video).values(c).execute();
    console.log('Inserted', c.length, 'Videos');
  }

  console.log('done inserting', insertValues.length, 'videos');
};
