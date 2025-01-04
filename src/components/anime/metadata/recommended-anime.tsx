import { AnimeCard } from "@/components/layouts/anime-card";
import { AnimeGrid } from "@/components/layouts/anime-grid";
import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/react";
import { useState } from "react";

interface RecommendedAnimeProps {
  recommendedAnime: Exclude<
    RouterOutputs["mal"]["getAnimeInfo"],
    undefined
  >["recommendations"];
}

export const RecommendedAnime = ({
  recommendedAnime,
}: RecommendedAnimeProps) => {
  const [showMore, setShowMore] = useState(false);

  if (recommendedAnime.filter((anime) => anime.hiAnimeId).length === 0) {
    return null;
  }

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Recommended Anime</h3>
      <AnimeGrid>
        {recommendedAnime
          .filter((anime) => anime.hiAnimeId)
          .filter((_, i) => (showMore ? true : i < 6))
          .map((anime) => (
            <AnimeCard
              key={anime.node.id}
              url={`/anime/${anime.hiAnimeId}`}
              poster={anime.node.main_picture.large}
              title={anime.node.title}
              subtitle={`Recommended by ${anime.num_recommendations} users`}
            />
          ))}
      </AnimeGrid>
      {recommendedAnime.filter((anime) => anime.hiAnimeId).length > 6 && (
        <div className="mt-3 flex w-full justify-center">
          <Button
            onClick={() => setShowMore((prev) => !prev)}
            variant={"ghost"}
          >
            {showMore ? "Show less" : "Show more"}
          </Button>
        </div>
      )}
    </>
  );
};
