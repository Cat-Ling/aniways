import { getRecentlyReleasedAnime } from '@aniways/data-access';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get('page') || '1');

  const { anime, hasNext } = await getRecentlyReleasedAnime(page);

  const nextUrl = new URL(req.nextUrl.href);
  nextUrl.searchParams.set('page', String(page + 1));

  const prevUrl = new URL(req.nextUrl.href);
  prevUrl.searchParams.set('page', String(page - 1));

  return NextResponse.json({
    pagination: {
      current: {
        url: req.nextUrl.toString(),
        page,
      },
      next: hasNext
        ? {
            url: nextUrl.toString(),
            page: page + 1,
          }
        : null,
      prev:
        page > 1
          ? {
              url: prevUrl.toString(),
              page: page - 1,
            }
          : null,
      total: anime.length,
    },
    anime,
  });
};
