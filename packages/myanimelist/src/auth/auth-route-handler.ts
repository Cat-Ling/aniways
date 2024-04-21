import { createMyAnimeListFetchHandler } from '@animelist/auth-next/server';

type Routes = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// eslint-disable-next-line no-unused-vars
type Handler = (request: Request) => Promise<Response>;

export type AuthRouteHandler = Record<Routes, Handler>;

const handler = createMyAnimeListFetchHandler({
  redirectAfterSignOutUrl: '/api/myanimelist/auth/redirect',
  redirectAfterSignInUrl: '/api/myanimelist/auth/redirect',
});

export const authRouteHandler: AuthRouteHandler = {
  GET: handler,
  POST: handler,
  PATCH: handler,
  DELETE: handler,
};
