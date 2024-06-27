"use client";

import type { RouterOutputs } from "@aniways/api";

import { api } from "~/trpc/react";
import { AnimeGrid } from "../anime-grid";

interface RecentlyReleasedAnimeClientProps {
  recentlyReleasedAnime: RouterOutputs["anime"]["recentlyReleased"];
  page: number;
}

export const RecentlyReleasedAnimeClient = (
  props: RecentlyReleasedAnimeClientProps
) => {
  const recentlyReleasedQuery = api.anime.recentlyReleased.useQuery(
    {
      page: props.page,
    },
    {
      initialData: props.recentlyReleasedAnime,
    }
  );

  return (
    <AnimeGrid
      animes={recentlyReleasedQuery.data.recentlyReleased}
      type="home"
    />
  );
};
