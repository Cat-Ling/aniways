import { api } from "@/trpc/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const seasonalAnime = await api.mal.getCurrentSeasonalAnime();

  return NextResponse.json(seasonalAnime);
};
