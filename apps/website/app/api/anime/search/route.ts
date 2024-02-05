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

  return NextResponse.json(
    {
      query,
      anime: animes,
      pagination: {
        current: page,
        next: hasNext ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      },
    },
    {
      status: 200,
    }
  );
};
