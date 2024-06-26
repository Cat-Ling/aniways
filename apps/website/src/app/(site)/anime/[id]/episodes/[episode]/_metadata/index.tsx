"use client";

import { useEffect } from "react";

import type { RouterOutputs } from "@aniways/api";
import { Skeleton } from "@aniways/ui/skeleton";

import ErrorPage from "~/app/error";
import { api } from "~/trpc/react";
import { AnimeMetadataDetails } from "./anime-metadata-details";
import { RelatedAnime } from "./related-anime";

interface AnimeMetadataProps {
  anime: Exclude<RouterOutputs["anime"]["byId"], undefined>;
}

export const AnimeMetadata = ({ anime }: AnimeMetadataProps) => {
  const {
    data: metadata,
    isLoading,
    isError,
    error,
  } = api.myAnimeList.getAnimeMetadata.useQuery(anime);

  const { mutate: updateMalAnimeId } = api.anime.updateMalAnimeId.useMutation();

  useEffect(() => {
    if (anime.malAnimeId) return;
    if (!metadata?.mal_id) return;

    updateMalAnimeId({
      id: anime.id,
      malId: metadata.mal_id,
    });
  }, [metadata, anime, updateMalAnimeId]);

  if (isLoading || !metadata) {
    return <Skeleton className="mb-6 h-[500px] w-full" />;
  }

  if (isError) {
    return <ErrorPage error={{ ...error, name: "error" }} />;
  }

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <AnimeMetadataDetails anime={anime} metadata={metadata} />
      <RelatedAnime relatedAnime={metadata.relatedAnime} />
    </>
  );
};
