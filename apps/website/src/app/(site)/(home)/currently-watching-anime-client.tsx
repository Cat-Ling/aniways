"use client";

import type { RouterOutputs } from "@aniways/api";

import { api } from "~/trpc/react";
import { AnimeGrid } from "../anime-grid";

interface CurrentlyWatchingAnimeClientProps {
  newReleases: RouterOutputs["anime"]["continueWatching"];
}

export const CurrentlyWatchingAnimeClient = (
  props: CurrentlyWatchingAnimeClientProps
) => {
  const newReleasesQuery = api.anime.continueWatching.useQuery(undefined, {
    initialData: props.newReleases,
  });

  return <AnimeGrid animes={newReleasesQuery.data} type="home" />;
};
