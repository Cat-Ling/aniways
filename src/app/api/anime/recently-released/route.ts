import { getRecentlyReleased } from '@/data-access/anime';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get('page') || '1');

  return NextResponse.json(await getRecentlyReleased(page));
};
