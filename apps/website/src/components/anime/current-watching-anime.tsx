"use client";

import type { RouterOutputs } from "@aniways/trpc";

import { AnimeGrid } from "~/components/layouts/anime-grid";
import { api } from "~/trpc/react";

interface CurrentlyWatchingAnimeProps {
  newReleases: RouterOutputs["anime"]["continueWatching"];
}

export const CurrentlyWatchingAnime = (props: CurrentlyWatchingAnimeProps) => {
  const newReleasesQuery = api.anime.continueWatching.useQuery(undefined, {
    initialData: props.newReleases,
  });

  if (!newReleasesQuery.data.length) return null;

  return (
    <>
      <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
        Continue Watching
      </h1>
      <div className="mb-6">
        <AnimeGrid animes={newReleasesQuery.data} type="home" />
      </div>
    </>
  );
};
