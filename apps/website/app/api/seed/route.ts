import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { seed } from '@aniways/database/src/database/seeding/seed';
import { seed as seedTitles } from '@aniways/database/src/database/seeding/seed-titles';
import { seedVideos } from '@aniways/database/src/database/seeding/seed-videos';

const schema = z.object({
  type: z.enum(['anime', 'video', 'title']),
});

export const POST = async (req: NextRequest) => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const body = req.nextUrl.searchParams.get('type');

  const { type } = schema.parse({
    type: body,
  });

  if (type === 'anime') {
    seed();
  } else if (type === 'video') {
    seedVideos();
  } else {
    seedTitles();
  }

  return NextResponse.json({ message: 'Started seeding database' });
};

export const GET = POST;
