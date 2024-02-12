import { getRecentlyReleasedAnime } from '../anime';
import db from '.';
import { video } from './schema';

import parse from 'node-html-parser';
import { createId } from '@paralleldrive/cuid2';
import { readFile, writeFile } from 'fs/promises';
import { chunk } from 'lodash';

const URLS = [
  {
    url: 'https://anitaku.to',
  },
  {
    url: 'https://embtaku.pro/videos',
  },
  {
    url: 'https://gogoanime3.co',
  },
] as const;

async function getVideoSourceUrl(name: string, episode: number | string) {
  const videoUrls = await Promise.all(
    URLS.map(async ({ url }) => {
      console.log('Fetching', `${url}/${name}-episode-${episode}`);
      const iframe = await fetch(`${url}/${name}-episode-${episode}`)
        .then(res => res.text())
        .then(html => parse(html))
        .then(dom => dom.querySelector('iframe')?.getAttribute('src'));
      console.log(
        'Fetched',
        iframe,
        'from',
        `${url}/${name}-episode-${episode}`
      );

      return iframe;
    })
  );

  return videoUrls.filter(v => v !== undefined) as string[];
}

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
            await getRecentlyReleasedAnime(_page)
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

  const recentlyReleasedAnime = await fetchRecentlyReleased(1);

  console.log(
    'Fetched',
    recentlyReleasedAnime.length,
    'Recently Released Animes'
  );

  console.log('Started fetching animes from DB');
  const allAnimes = await db.query.anime.findMany();
  console.log('Fetched', allAnimes.length, 'animes from db');

  console.log('Started fetching videos');

  let videos = 0;

  for (const c of chunk(recentlyReleasedAnime, 100)) {
    await Promise.all(
      c.map(async a => {
        console.log('Fetching videos from', a.name);
        const animeFromDb = allAnimes.find(anime => anime.slug === a.slug);
        console.log('Found anime from db', animeFromDb?.title);
        if (!animeFromDb) return Promise.resolve(undefined);
        const episodes = Array.from({ length: a.episode < 1 ? 1 : a.episode })
          .map((_, i) => a.episode - i)
          .reverse();
        console.log(
          'Fetching',
          episodes.length,
          'episodes from',
          a.name,
          `(${a.slug})`
        );
        const videoUrls = await Promise.all(
          episodes.map(async ep => ({
            urls: await getVideoSourceUrl(a.slug, ep),
            ep,
          }))
        );
        console.log('Fetched', videoUrls.length, 'episodes from', a.name);
        const insertValues = videoUrls
          .map(({ urls, ep }) => {
            return urls.map(url => ({
              id: createId(),
              animeId: animeFromDb.id,
              episode: String(ep),
              url: url,
            }));
          })
          .flat();

        videos += insertValues.length;

        await writeFile(
          `episodes/${a.slug}.json`,
          JSON.stringify(insertValues, null, 2)
        );

        const file = await readFile(`episodes/${a.slug}.json`);

        console.log('Wrote', file.byteLength, 'bytes to', a.slug);
      })
    );
  }

  console.log('Fetched', videos, 'videos');

  // await Promise.all(
  //   chunk(insertValues, 1000).map(async values => {
  //     console.log('Inserting', values.length, 'Videos');
  //     return db.insert(video).values(values).execute();
  //   })
  // );

  console.log('done inserting videos');
};
