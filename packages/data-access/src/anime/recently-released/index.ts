import { RecentlyReleasedAnime } from '../../types';
import getRecentlyReleasedAnimeFromAllAnime from './allanime';
import getRecentlyReleasedAnimeFromAnitaku from './anitaku';
import getRecentlyReleasedAnimeFromGogo from './gogoanime';
import getRecentlyReleasedAnimeFromGogoTaku from './gogotaku';
import { sanitizeName } from '../../utils/sanitize-name';

export default async function getRecentlyReleasedAnime(page: number) {
  const functions = [
    {
      fn: getRecentlyReleasedAnimeFromAllAnime,
      name: 'AllAnime',
    },
    {
      fn: getRecentlyReleasedAnimeFromAnitaku,
      name: 'Anitaku',
    },
    {
      fn: getRecentlyReleasedAnimeFromGogoTaku,
      name: 'GogoTaku',
    },
    {
      fn: getRecentlyReleasedAnimeFromGogo,
      name: 'Gogo',
    },
  ] as const;

  // fetch anime
  // if fails or takes more than 2 seconds, move to the next one
  const getAnime = async (
    page: number,
    name: string,
    index: number,
    fn: (typeof functions)[number]['fn']
  ): Promise<{
    anime: (RecentlyReleasedAnime & {
      url: string;
    })[];
    hasNext: boolean;
  }> => {
    try {
      let done = false;
      new Promise((_, reject) => {
        setTimeout(() => {
          if (!done) reject('Timeout');
        }, 5000);
      });
      const anime = await fn(page);
      const hasNext = await fn(page + 1).then(res => !!res.length);
      done = true;
      console.log(`Fetched ${name} anime`);
      return {
        anime: anime.map(show => ({
          ...show,
          url: `/anime/${sanitizeName(show.name)}/episodes/${show.episode}`,
        })),
        hasNext,
      };
    } catch (e) {
      console.error(`Failed to fetch ${name} anime`, e);
      const nextFn = functions.at(index + 1);
      if (nextFn) {
        return await getAnime(page, nextFn.name, index + 1, nextFn.fn);
      }
      return {
        anime: [],
        hasNext: false,
      };
    }
  };

  return await getAnime(page, functions[0].name, 0, functions[0].fn);
}
