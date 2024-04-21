import { authRouteHandler } from '@aniways/myanimelist';
import { redirect } from './redirect';
import { signIn } from './sign-in';
import { signOut } from './sign-out';

export const api = async (req: Request) => {
  const map = [redirect, signIn, signOut].reduce(
    (acc, fn) => ({ ...acc, [fn.url]: fn }),
    // eslint-disable-next-line no-unused-vars
    {} as Record<string, (req: Request) => Promise<Response>>
  );

  const url = new URL(req.url);

  const fn = map[url.pathname];

  if (!fn) {
    return authRouteHandler.GET(req);
  }

  return fn(req);
};
