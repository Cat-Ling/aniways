import getRecentlyReleasedAnimeFromAllAnime from './allanime';
import getRecentlyReleasedAnimeFromAnitaku from './anitaku';
import getRecentlyReleasedAnimeFromGogo from './gogoanime';
import getRecentlyReleasedAnimeFromGogoTaku from './gogotaku';

export default async function getRecentlyReleasedAnime(page: number) {
  const functions = [
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
    {
      fn: getRecentlyReleasedAnimeFromAllAnime,
      name: 'AllAnime',
    },
  ] as const;

  // fetch anime
  // if fails or takes more than 5 seconds, move to the next one
  const getAnime = async (
    page: number,
    index: number
  ): Promise<{
    anime: Awaited<ReturnType<(typeof functions)[0]['fn']>>;
    hasNext: boolean;
  }> => {
    const { name, fn } = functions[index]!;

    try {
      const abortController = new AbortController();
      const nextAbortController = new AbortController();

      console.log(`Fetching ${name} anime`);

      const timeout = setTimeout(() => {
        abortController.abort(
          new Error(`Timeout for ${name} current page: ${page}`)
        );
        nextAbortController.abort(
          new Error(`Timeout for ${name} next page: ${page + 1}`)
        );
      }, 5000);

      const [anime, hasNext] = await Promise.all([
        fn(page, abortController.signal),
        fn(page + 1, nextAbortController.signal).then(res => !!res.length),
      ]);

      clearTimeout(timeout);
      console.log(`Fetched ${name} anime`);

      return {
        anime: anime,
        hasNext,
      };
    } catch (e) {
      console.error(`Failed to fetch ${name} anime`, e);

      if (index + 1 < functions.length) {
        return await getAnime(page, index + 1);
      }

      return {
        anime: [],
        hasNext: false,
      };
    }
  };

  return await getAnime(page, 0);
}
