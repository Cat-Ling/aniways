import { getRecentlyUpdatedAnime } from '$lib/api/anime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
  const page = Number(url.searchParams.get('page') || '1');
  const recentlyUpdated = await getRecentlyUpdatedAnime(fetch, page, 20);

  return {
    title: '',
    recentlyUpdated
  };
};
