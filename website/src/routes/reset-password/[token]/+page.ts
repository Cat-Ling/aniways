import { getUserFromToken } from '$lib/api/auth';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const { token } = params;

  const user = await getUserFromToken(fetch, token).catch(() => null);

  if (!user) {
    return {
      error: 'Invalid or expired token'
    };
  }

  return {
    user,
    token
  };
};
