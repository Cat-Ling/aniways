import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./server/auth";

export async function middleware(req: NextRequest) {
  const {
    method,
    url,
    nextUrl: { pathname, searchParams },
    cookies,
  } = req;
  const session = await auth(cookies);

  console.log({
    url,
    pathname,
    searchParams: Object.fromEntries(searchParams),
    method,
    user: session?.user,
  });

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|download.svg|subtitle.svg|logo).*)",
  ],
};
