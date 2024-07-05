import type { Handler } from "../types";
import { redirect } from "./redirect";
import { signIn } from "./sign-in";
import { signOut } from "./sign-out";

export const api = (handler: Handler) => {
  return async (req: Request) => {
    const map = [redirect, signIn(handler), signOut].reduce(
      (acc, fn) => ({ ...acc, [fn.url]: fn }),
      {} as Record<string, (req: Request) => Promise<Response> | Response>
    );

    const url = new URL(req.url);

    const fn = map[url.pathname];

    if (!fn) {
      return handler(req);
    }

    return fn(req);
  };
};
