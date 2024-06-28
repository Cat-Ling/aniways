"use client";

import type { RouterOutputs } from "@aniways/api";

import { AnimeGrid } from "~/components/layouts/anime-grid";
import { api } from "~/trpc/react";

interface RecentlyReleasedAnimeProps {
  recentlyReleasedAnime: RouterOutputs["anime"]["recentlyReleased"];
  page: number;
}

export const RecentlyReleasedAnime = ({
  recentlyReleasedAnime,
  ...input
}: RecentlyReleasedAnimeProps) => {
  const recentlyReleasedQuery = api.anime.recentlyReleased.useQuery(input, {
    initialData: recentlyReleasedAnime,
  });

  return (
    <AnimeGrid
      animes={recentlyReleasedQuery.data.recentlyReleased}
      type="home"
    />
  );
};
