"use client";

import { api } from "@/trpc/react";
import {
  AnimeMetadataDetails,
  AnimeMetadataLoader,
} from "./anime-metadata-details";
import { RelatedAnime } from "./related-anime";
import { RecommendedAnime } from "./recommended-anime";

export const AnimeMetadata = (props: { malId: number }) => {
  const [metadata] = api.mal.getAnimeInfo.useSuspenseQuery({
    malId: props.malId,
  });

  if (!metadata) {
    return (
      <>
        <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
        <AnimeMetadataLoader />
      </>
    );
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
