"use client";

import ErrorPage from "@/app/error";
import { api, type RouterOutputs } from "@/trpc/react";
import {
  AnimeMetadataDetails,
  AnimeMetadataLoader,
} from "./anime-metadata-details";
import { RelatedAnime } from "./related-anime";
import { RecommendedAnime } from "./recommended-anime";

export const AnimeMetadata = (props: {
  malId: number;
  initialData: RouterOutputs["mal"]["getAnimeInfo"];
}) => {
  const {
    data: metadata,
    isLoading,
    error,
    isError,
  } = api.mal.getAnimeInfo.useQuery(
    {
      malId: props.malId,
    },
    props,
  );

  if (isLoading || !metadata) {
    return (
      <>
        <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
        <AnimeMetadataLoader />
      </>
    );
  }

  if (isError) {
    return <ErrorPage error={{ ...error, name: "error" }} />;
  }

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <AnimeMetadataDetails metadata={metadata} />
      <RelatedAnime relatedAnime={metadata.relatedAnime} />
      <RecommendedAnime recommendedAnime={metadata.recommendations} />
    </>
  );
};
