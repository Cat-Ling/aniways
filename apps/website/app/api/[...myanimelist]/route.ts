import { authRouteHandler } from '@aniways/myanimelist';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const { GET: authGet, POST, PATCH, DELETE } = authRouteHandler;

export const GET = async (req: NextRequest) => {
  if (req.nextUrl.pathname === '/api/myanimelist/auth/redirect') {
    const redirectUrl = req.cookies.get('redirectUrl')?.value;
    return NextResponse.redirect(redirectUrl || req.nextUrl.origin, {
      headers: req.headers,
    });
  }

  if (req.nextUrl.pathname === '/api/myanimelist/auth/sign-in') {
    const redirectUrl =
      req.nextUrl.searchParams.get('redirectUrl') ?? req.nextUrl.origin;
    const res = await authGet(req);
    cookies().set('redirectUrl', redirectUrl);
    return res;
  }

  if (req.nextUrl.pathname === '/api/myanimelist/auth/sign-out') {
    const redirectUrl =
      req.nextUrl.searchParams.get('redirectUrl') ?? req.nextUrl.origin;

    const cookie = cookies();

    cookie.delete('mal.session');
    cookie.delete('mal.csrf');
    cookie.delete('mal.code_challenge');
    cookie.delete('mal.access_token');
    cookie.delete('redirectUrl');

    return NextResponse.redirect(redirectUrl);
  }

  return authGet(req);
};
