import {
  createMyAnimeListFetchHandler,
  getUser,
} from "@animelist/auth-next/server";
import { signIn } from "./routes/sign-in";
import { signOut } from "./routes/sign-out";
import { redirect } from "./routes/redirect";
import { session } from "./routes/session";
import { callback } from "./routes/callback";

type Auth = typeof getUser;
type Routes = "GET" | "POST" | "PATCH" | "DELETE";
export type Handler = (request: Request) => Promise<Response>;
type AuthRouteHandler = Record<Routes, Handler>;

const handler = createMyAnimeListFetchHandler({
  redirectAfterSignOutUrl: "/api/myanimelist/auth/redirect",
  redirectAfterSignInUrl: "/api/myanimelist/auth/redirect",
  sessionDurationSeconds: 60 * 60 * 24 * 30, // 30 days
});

export const createAuthRouteHandler: () => AuthRouteHandler = () => ({
  GET: async (req) => {
    const api: Record<string, Handler> = {
      "/api/myanimelist/auth/sign-in": signIn(handler),
      "/api/myanimelist/auth/sign-out": signOut,
      "/api/myanimelist/auth/redirect": redirect,
      "/api/myanimelist/auth/session": session(handler),
      "/api/myanimelist/auth/callback": callback,
    };

    const url = new URL(req.url);
    const customHandler = api[url.pathname];

    return customHandler ? await customHandler(req) : await handler(req);
  },
  POST: handler,
  PATCH: handler,
  DELETE: handler,
});

export const auth: Auth = async (cookies, options) => {
  try {
    // NOTE: ensure that it does not crash when invalid token is present
    return await getUser(cookies, options);
  } catch {
    return undefined;
  }
};
