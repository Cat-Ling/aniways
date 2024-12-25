"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { AnimeGridLoader } from "../layouts/anime-grid-loader";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Image } from "../ui/image";
import { Play } from "lucide-react";

type ContinueWatchingProps = {
  initialData: RouterOutputs["mal"]["getContinueWatching"];
};

export const ContinueWatching = (props: ContinueWatchingProps) => {
  const {
    data: continueWatchingAnime,
    isLoading,
    error,
  } = api.mal.getContinueWatching.useQuery(undefined, {
    initialData: props.initialData,
  });

  if (isLoading) return <AnimeGridLoader />;

  if (error) return null;

  return (
    <>
      <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
        Continue Watching
      </h1>
      <div className="mb-6">
        <ul className="grid h-full grid-cols-2 gap-3 md:grid-cols-6">
          {continueWatchingAnime?.map((anime) => (
            <li
              key={anime.malAnime.node.id}
              className="group rounded-md border border-border bg-background p-2"
            >
              <Link
                href={`/anime/${anime.animeId}/episodes/${anime.lastWatchedEpisode + 1}`}
                className="flex h-full flex-col gap-3"
              >
                <div className="relative">
                  <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                    <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                    <Image
                      src={anime.malAnime.node.main_picture.large ?? ""}
                      alt={anime.malAnime.node.title ?? ""}
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
                    {anime.malAnime.node.title ?? "????"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    Episode {anime.lastWatchedEpisode + 1}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
