import { getHistory } from '$lib/api/library';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const history = await getHistory(fetch, page, 20);

  return {
    history
  };
};
