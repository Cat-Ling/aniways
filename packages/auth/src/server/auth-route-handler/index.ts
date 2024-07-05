import { createMyAnimeListFetchHandler } from "@animelist/auth-next/server";

import type { AuthRouteHandler } from "./types";
import { api } from "./api";

const handler = createMyAnimeListFetchHandler({
  redirectAfterSignOutUrl: "/api/myanimelist/auth/redirect",
  redirectAfterSignInUrl: "/api/myanimelist/auth/redirect",
  sessionDurationSeconds: 60 * 60 * 24 * 30, // 30 days
});

export const createAuthRouteHandler: () => AuthRouteHandler = () => ({
  GET: api(handler),
  POST: handler,
  PATCH: handler,
  DELETE: handler,
});
