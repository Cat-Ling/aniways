"use client";

import { useEffect } from "react";

import { Skeleton } from "@aniways/ui/skeleton";

import ErrorPage from "~/app/error";
import { api } from "~/trpc/react";
import { AnimeMetadataDetails } from "./anime-metadata-details";
import { RelatedAnime } from "./related-anime";

interface AnimeMetadataProps {
  id: string;
}

export const AnimeMetadata = ({ id }: AnimeMetadataProps) => {
  const animeQuery = api.anime.byId.useQuery(
    { id },
    {
      staleTime: 0,
    }
  );

  const {
    data: metadata,
    isLoading,
    isError,
    error,
  } = api.myAnimeList.getAnimeMetadata.useQuery(
    animeQuery.data?.malAnimeId ?
      {
        malId: animeQuery.data.malAnimeId,
      }
    : {
        title: animeQuery.data?.title ?? "",
      },
    {
      enabled: !animeQuery.isLoading,
    }
  );

  const { mutate: updateMalAnimeId } = api.anime.updateMalAnimeId.useMutation();

  useEffect(() => {
    if (!animeQuery.data) return;
    if (animeQuery.data.malAnimeId) return;
    if (!metadata?.mal_id) return;

    updateMalAnimeId({
      id: animeQuery.data.id,
      malId: metadata.mal_id,
    });
  }, [metadata, animeQuery, updateMalAnimeId]);

  if (animeQuery.isLoading || isLoading || !metadata || !animeQuery.data) {
    return <Skeleton className="mb-6 h-[500px] w-full" />;
  }

  if (isError) {
    return <ErrorPage error={{ ...error, name: "error" }} />;
  }

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <AnimeMetadataDetails anime={animeQuery.data} metadata={metadata} />
      <RelatedAnime relatedAnime={metadata.relatedAnime} />
    </>
  );
};
