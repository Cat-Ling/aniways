import { authRouteHandler } from '@aniways/myanimelist';
import { cookies } from '../cookies';

async function _signIn(req: Request) {
  const url = new URL(req.url);

  const redirectUrl = url.searchParams.get('redirectUrl') ?? url.origin;

  const res = await authRouteHandler.GET(req);

  cookies(req, res.headers as Headers).set('redirectUrl', redirectUrl);

  return res;
}

export const signIn = Object.assign(_signIn, {
  url: '/api/myanimelist/auth/sign-in',
});
