import { cookies } from '../cookies';
import { Handler } from '../types';

const _signIn = (handler: Handler) => async (req: Request) => {
  const url = new URL(req.url);

  const redirectUrl = url.searchParams.get('redirectUrl') ?? url.origin;

  const res = await handler(req);

  cookies(req, res.headers as Headers).set('redirectUrl', redirectUrl);

  return res;
};

export const signIn = (handler: Handler) => {
  return Object.assign(_signIn(handler), {
    url: '/api/myanimelist/auth/sign-in',
  });
};
