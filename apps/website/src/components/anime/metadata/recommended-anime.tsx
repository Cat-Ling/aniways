import { useState } from "react";

import type { RouterOutputs } from "@aniways/trpc";
import { Button } from "@aniways/ui/button";

import { AnimeGrid } from "~/components/layouts/anime-grid";

interface RecommendedAnimeProps {
  recommendedAnime: Exclude<
    RouterOutputs["myAnimeList"]["getAnimeMetadata"],
    undefined
  >["recommendations"];
}

export const RecommendedAnime = ({
  recommendedAnime,
}: RecommendedAnimeProps) => {
  const [showMore, setShowMore] = useState(false);

  if (recommendedAnime.length === 0) return null;

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Recommended Anime</h3>
      <AnimeGrid
        animes={recommendedAnime.slice(0, showMore ? -1 : 5).map(rec => {
          return {
            id: rec.id,
            title: rec.node.title,
            image: rec.node.main_picture.large,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            lastEpisode: String(rec.node.num_episodes ?? "???"),
            recommendations: rec.num_recommendations,
          };
        })}
        type="related"
      />
      {recommendedAnime.length > 5 && (
        <div className="mt-3 flex w-full justify-center">
          <Button onClick={() => setShowMore(prev => !prev)} variant={"ghost"}>
            {showMore ? "Show less" : "Show more"}
          </Button>
        </div>
      )}
    </>
  );
};
