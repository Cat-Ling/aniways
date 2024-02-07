import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const Schema = z.object({
  key: z.string(),
  path: z.string(),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { key, path } = Schema.parse(body);
    if (key !== process.env.REVALIDATE_KEY) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
    }
    revalidatePath(path);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: (e as any)?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
};
