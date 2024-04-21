import { authRouteHandler } from '@aniways/myanimelist';
import { cookies } from './cookies';

const authGet = authRouteHandler.GET;

const GET = async (req: Request) => {
  const url = new URL(req.url);

  if (url.pathname === '/api/myanimelist/auth/redirect') {
    const redirectUrl = cookies(req, new Headers()).get('redirectUrl')?.value;

    req.headers.append('Location', redirectUrl || url.origin);

    const response = new Response(null, {
      status: 302,
      headers: req.headers,
    });

    return response;
  }

  if (url.pathname === '/api/myanimelist/auth/sign-in') {
    const redirectUrl = url.searchParams.get('redirectUrl') ?? url.origin;
    const res = await authGet(req);
    cookies(req, res.headers as Headers).set('redirectUrl', redirectUrl);
    return res;
  }

  if (url.pathname === '/api/myanimelist/auth/sign-out') {
    const redirectUrl = url.searchParams.get('redirectUrl') ?? url.origin;

    const headers = new Headers();

    const cookiesObj = cookies(req, headers);

    cookiesObj.delete('mal.session');
    cookiesObj.delete('mal.csrf');
    cookiesObj.delete('mal.code_challenge');
    cookiesObj.delete('mal.access_token');
    cookiesObj.delete('redirectUrl');

    headers.append('Location', redirectUrl);

    const response = new Response(null, {
      status: 302,
      headers: headers,
    });

    return response;
  }

  return authGet(req);
};

export const createAuthRouteHandler = () => {
  return {
    ...authRouteHandler,
    GET,
  };
};
