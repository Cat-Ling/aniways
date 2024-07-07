"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import type { RouterOutputs } from "@aniways/trpc";
import { Skeleton } from "@aniways/ui/skeleton";

import ErrorPage from "~/app/error";
import { api } from "~/trpc/react";
import { AnimeMetadataDetails } from "./anime-metadata-details";
import { RelatedAnime } from "./related-anime";

interface AnimeMetadataProps {
  anime: RouterOutputs["anime"]["byId"];
}

export const AnimeMetadata = ({ anime }: AnimeMetadataProps) => {
  const params = useParams();

  const id = useMemo(() => {
    if (typeof params.id === "string") {
      return params.id;
    }

    return params.id?.[0] ?? "";
  }, [params.id]);

  const animeQuery = api.anime.byId.useQuery(
    { id },
    {
      initialData: anime,
    }
  );

  const {
    data: metadata,
    isError,
    error,
  } = api.myAnimeList.getAnimeMetadata.useQuery(
    animeQuery.data?.malAnimeId ?
      {
        malId: animeQuery.data.malAnimeId,
      }
    : {
        title: animeQuery.data?.title ?? "",
        slug: animeQuery.data?.slug ?? "",
      },
    {
      enabled: !animeQuery.isLoading,
    }
  );

  const utils = api.useUtils();

  const { mutate: updateMalAnimeId } = api.anime.updateMalAnimeId.useMutation({
    onSuccess: async () => {
      await utils.anime.byId.invalidate({ id });
    },
  });

  useEffect(() => {
    if (!animeQuery.data) return;
    if (animeQuery.data.malAnimeId) return;
    if (!metadata?.id) return;

    updateMalAnimeId({
      id: animeQuery.data.id,
      malId: metadata.id,
    });
  }, [animeQuery.data, metadata, updateMalAnimeId]);

  if (isError) {
    return <ErrorPage error={{ ...error, name: "error" }} />;
  }

  if (!metadata || !animeQuery.data) {
    return <Skeleton className="mb-6 h-[500px] w-full" />;
  }

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <AnimeMetadataDetails anime={animeQuery.data} metadata={metadata} />
      <RelatedAnime relatedAnime={metadata.relatedAnime} />
    </>
  );
};
