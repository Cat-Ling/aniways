import { api } from './api';

import { createMyAnimeListFetchHandler } from '@animelist/auth-next/server';
import { AuthRouteHandler } from './types';

const handler = createMyAnimeListFetchHandler({
  redirectAfterSignOutUrl: '/api/myanimelist/auth/redirect',
  redirectAfterSignInUrl: '/api/myanimelist/auth/redirect',
});

export const createAuthRouteHandler: () => AuthRouteHandler = () => ({
  GET: api(handler),
  POST: handler,
  PATCH: handler,
  DELETE: handler,
});
