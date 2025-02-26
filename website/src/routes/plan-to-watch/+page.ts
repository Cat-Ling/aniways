import { getPlanToWatchAnime } from '$lib/api/library';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const page = Number(url.searchParams.get('page') || 1);
  const planToWatch = await getPlanToWatchAnime(fetch, page, 30);

  return {
    planToWatch
  };
};
