import { createMyAnimeListFetchHandler } from '@animelist/auth-next/server';

type Routes = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type AuthRouteHandler = Record<
  Routes,
  ReturnType<typeof createMyAnimeListFetchHandler>
>;

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
