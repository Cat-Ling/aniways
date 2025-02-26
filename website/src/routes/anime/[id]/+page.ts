import { getLibraryItem } from '$lib/api/library';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const library = await getLibraryItem(fetch, params.id);

  return {
    library
  };
};
