import type { Handler } from "../types";
import { redirect } from "./redirect";
import { session } from "./session";
import { signIn } from "./sign-in";
import { signOut } from "./sign-out";

export const api = (handler: Handler) => {
  return async (req: Request) => {
    const map = [redirect, signIn(handler), signOut, session(handler)].reduce(
      (acc, fn) => ({ ...acc, [fn.url]: fn }),
      {} as Record<string, (req: Request) => Promise<Response> | Response>
    );

    const url = new URL(req.url);

    const fn = map[url.pathname];

    const res = fn ? await fn(req) : await handler(req);

    // A hack to convert all set-cookie headers to use .aniways.xyz
    // eslint-disable-next-line no-restricted-properties
    if (process.env.NODE_ENV === "production") {
      const setCookies = res.headers.get("set-cookie")?.split(", ") ?? [];
      const newCookies = setCookies.map(
        cookie => cookie + "; Domain=.aniways.xyz"
      );
      res.headers.set("set-cookie", newCookies.join(", "));
    }

    return res;
  };
};
