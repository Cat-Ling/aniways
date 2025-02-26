import { getInstalledProviders } from '$lib/api/auth';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const providers = await getInstalledProviders(fetch);

  return {
    providers
  };
};
