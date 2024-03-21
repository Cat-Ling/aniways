import { createMyAnimeListFetchHandler } from '@animelist/auth-next/server';

type Routes = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type AuthRouteHandler = Record<
  Routes,
  ReturnType<typeof createMyAnimeListFetchHandler>
>;

const handler = createMyAnimeListFetchHandler();

export const authRouteHandler: AuthRouteHandler = {
  GET: handler,
  POST: handler,
  PATCH: handler,
  DELETE: handler,
};
