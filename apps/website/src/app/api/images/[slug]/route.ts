import type { NextRequest } from "next/server";
import { notFound } from "next/navigation";

import { env } from "~/env";

export const GET = async (
  req: NextRequest,
  ctx: { params: { slug: string } }
) => {
  if (env.NODE_ENV === "production") {
    return notFound();
  }

  const url = Buffer.from(ctx.params.slug, "base64url").toString("utf-8");

  const blob = await fetch(url, {
    headers: {
      referer: new URL(url).origin,
    },
  });

  const blobBuffer = await blob.arrayBuffer();

  return new Response(Buffer.from(blobBuffer), {
    headers: {
      "Content-Type": blob.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable", // 1 year
    },
  });
};
