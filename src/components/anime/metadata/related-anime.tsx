import { useState, type FC } from "react";
import { type RouterOutputs } from "@/trpc/react";
import { AnimeGrid } from "@/components/layouts/anime-grid";
import { AnimeCard } from "@/components/layouts/anime-card";
import { Button } from "@/components/ui/button";

interface RelatedAnimeProps {
  relatedAnime: Exclude<
    RouterOutputs["mal"]["getAnimeInfo"],
    undefined
  >["relatedAnime"];
}

export const RelatedAnime: FC<RelatedAnimeProps> = (props) => {
  const [showMore, setShowMore] = useState(false);

  if (props.relatedAnime.filter((anime) => anime.hiAnimeId).length === 0) {
    return null;
  }

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Related Anime</h3>
      <AnimeGrid>
        {props.relatedAnime
          .filter((anime) => anime.hiAnimeId)
          .filter((_, i) => (showMore ? true : i < 6))
          .map((anime) => (
            <AnimeCard
              key={anime.node.id}
              url={`/anime/${anime.hiAnimeId}`}
              poster={anime.node.main_picture.large}
              title={anime.node.title}
              subtitle={anime.relation_type_formatted}
            />
          ))}
      </AnimeGrid>
      {props.relatedAnime.filter((anime) => anime.hiAnimeId).length > 6 && (
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
