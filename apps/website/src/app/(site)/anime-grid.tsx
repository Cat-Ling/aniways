import Link from "next/link";
import { Play } from "lucide-react";

import { Image } from "@aniways/ui/aniways-image";
import { Skeleton } from "@aniways/ui/skeleton";

interface AnimeGridProps {
  type: "home" | "search";
  animes: {
    id: string;
    title: string;
    lastEpisode: string | null;
    image: string;
  }[];
}

export const AnimeGridLoader = ({ length = 20 }: { length?: number }) => {
  return (
    <ul className="grid h-full grid-cols-2 gap-3 md:grid-cols-5">
      {Array.from({ length }).map((_, i) => (
        <Skeleton key={i} className="h-[262px] md:h-[440px]" />
      ))}
    </ul>
  );
};

export const AnimeGrid = (props: AnimeGridProps) => {
  const { animes, type } = props;

  return (
    <ul className="grid h-full grid-cols-2 gap-3 md:grid-cols-5">
      {animes.map((anime) => {
        const { title, lastEpisode, image, id } = anime;

        const url =
          type === "home"
            ? `/anime/${id}/episodes/${lastEpisode?.replace(".", "-")}`
            : `/anime/${id}`;

        return (
          <li
            key={anime.id}
            className="group rounded-md border border-border bg-background p-2"
          >
            <Link href={url} className="flex h-full flex-col gap-3">
              <div className="relative">
                <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                  <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                  <Image
                    src={image}
                    alt={title}
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
                  {title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {type === "home"
                    ? `Episode ${lastEpisode}`
                    : `${lastEpisode} episodes`}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
