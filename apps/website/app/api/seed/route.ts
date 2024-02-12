import { notFound } from 'next/navigation';
import { seed } from '@aniways/data-access/src/database/seed';
import { seedVideos } from '@aniways/data-access/src/database/seed-videos';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['anime', 'video']),
});

export const POST = async (req: NextRequest) => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const body = await req.json();

  const { type } = schema.parse(body);

  if (type === 'anime') {
    seed();
  } else {
    seedVideos();
  }

  return NextResponse.json({ message: 'Started seeding database' });
};
