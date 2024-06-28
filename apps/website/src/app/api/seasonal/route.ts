import { NextResponse } from "next/server";

import { api } from "~/trpc/server";

export const dynamic = "force-static";

export const revalidate = 86400; // 24 hours

export const GET = async () => {
  const seasonalAnime = await api.myAnimeList.getCurrentSeasonAnimes();

  return NextResponse.json(seasonalAnime);
};
