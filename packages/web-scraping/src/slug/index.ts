import scrapeAnimeSlugFromAnitaku from './anitaku';
import scrapeAnimeSlugFromGogoAnime from './gogoanime';

export default async function scrapeSlugFromAnimeEpisode(episodeSlug: string) {
  const functions = [
    scrapeAnimeSlugFromAnitaku,
    scrapeAnimeSlugFromGogoAnime,
  ] as const;

  const getSlug = async (
    fn: (typeof functions)[number]
  ): Promise<string | null> => {
    try {
      const abortController = new AbortController();

      const timeout = setTimeout(() => {
        abortController.abort(
          new Error('Timeout ' + fn.name + ' ' + episodeSlug)
        );
      }, 2000);

      const slug = await fn(episodeSlug, abortController.signal);

      clearTimeout(timeout);

      if (!slug) {
        throw new Error('Slug not found ' + fn.name + ' ' + episodeSlug);
      }

      return slug;
    } catch (e) {
      console.error(e);

      const nextFn = functions.at(functions.indexOf(fn) + 1);
      if (nextFn) {
        return getSlug(nextFn);
      }

      return null;
    }
  };

  return await getSlug(functions[0]);
}
