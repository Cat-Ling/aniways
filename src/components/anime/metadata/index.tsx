"use client";

import ErrorPage from "@/app/error";
import { api } from "@/trpc/react";
import { AnimeMetadataDetails } from "./anime-metadata-details";
import { Skeleton } from "@/components/ui/skeleton";

export const AnimeMetadata = (props: { malId: number }) => {
  const {
    data: metadata,
    isLoading,
    error,
    isError,
  } = api.mal.getAnimeInfo.useQuery({
    malId: props.malId,
  });

  if (isLoading || !metadata) {
    return <Skeleton className="mb-6 h-[500px] w-full" />;
  }

  if (isError) {
    return <ErrorPage error={{ ...error, name: "error" }} />;
  }

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <AnimeMetadataDetails metadata={metadata} />
      {/* <RelatedAnime relatedAnime={metadata.relatedAnime} />
      <RecommendedAnime recommendedAnime={metadata.recommendations} /> */}
    </>
  );
};
