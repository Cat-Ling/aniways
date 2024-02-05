import { searchAnime } from '@data/anime';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get('page') || '1');
  const query = req.nextUrl.searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      {
        error: 'Query is required',
      },
      {
        status: 400,
      }
    );
  }

  const { animes, hasNext } = await searchAnime(query, page);

  const nextUrl = new URL(req.nextUrl.href);
  nextUrl.searchParams.set('page', String(page + 1));

  const prevUrl = new URL(req.nextUrl.href);
  prevUrl.searchParams.set('page', String(page - 1));

  const next = hasNext
    ? {
        url: nextUrl.toString(),
        page: page + 1,
      }
    : null;

  const prev =
    page > 1
      ? {
          url: prevUrl.toString(),
          page: page - 1,
        }
      : null;

  return NextResponse.json(
    {
      query,
      pagination: {
        total: animes.length,
        current: {
          url: req.nextUrl.toString(),
          page,
        },
        next,
        prev,
      },
      anime: animes,
    },
    {
      status: 200,
    }
  );
};
