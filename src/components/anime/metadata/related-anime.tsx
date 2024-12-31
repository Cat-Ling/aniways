import type { FC } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { type RouterOutputs } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@/components/ui/image";

interface RelatedAnimeProps {
  relatedAnime: Exclude<
    RouterOutputs["mal"]["getAnimeInfo"],
    undefined
  >["relatedAnime"];
}

export const RelatedAnime: FC<RelatedAnimeProps> = (props) => {
  if (props.relatedAnime.length === 0) return null;

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Related Anime</h3>
      <section className="grid h-full grid-cols-2 gap-3 md:grid-cols-5">
        {props.relatedAnime
          .filter((anime) => anime.hiAnimeId)
          .map((anime) => (
            <Link
              key={anime.node.id}
              href={`/anime/${anime.hiAnimeId}`}
              className="group flex h-full flex-col gap-3 rounded-md border border-border bg-background p-2"
            >
              <div className="relative">
                <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                  <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                  <Image
                    src={anime.node.main_picture.large}
                    alt={anime.node.title}
                    width={450}
                    height={650}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-muted/70 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                  <Play className="h-8 w-8 text-primary" />
                  <p className="mt-2 text-lg font-bold text-foreground">
                    Watch Now
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <p className="line-clamp-2 text-xs transition group-hover:text-primary md:text-sm">
                  {anime.node.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {anime.relation_type_formatted}
                  {JSON.stringify(anime, null, 2)}
                </p>
              </div>
            </Link>
          ))}
      </section>
    </>
  );
};
