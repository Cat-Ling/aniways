import { cookies } from '../cookies';

async function _signOut(req: Request) {
  const url = new URL(req.url);

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

export const signOut = Object.assign(_signOut, {
  url: '/api/myanimelist/auth/sign-out',
});
