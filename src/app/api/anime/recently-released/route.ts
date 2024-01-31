import { getAnimeFromAllAnime } from '@/data-access/anime';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get('page') || '1');
  const query = req.nextUrl.searchParams.get('query') || '';

  return NextResponse.json(await getAnimeFromAllAnime(page, query));
};
