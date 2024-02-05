import { getRecentlyReleasedAnime } from '@aniways/data-access';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get('page') || '1');

  const { anime, hasNext } = await getRecentlyReleasedAnime(page);

  return NextResponse.json({
    anime,
    pagination: {
      current: page,
      next: hasNext ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    },
  });
};
