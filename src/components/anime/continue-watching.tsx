"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { AnimeGridLoader } from "../layouts/anime-grid-loader";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Image } from "../ui/image";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Pagination } from "../pagination";
import { cn } from "@/lib/utils";

type ContinueWatchingProps = {
  initialData: RouterOutputs["mal"]["getContinueWatching"];
};

export const ContinueWatching = (props: ContinueWatchingProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    if (pathname !== "/watching") return 1;
    const page = parseInt(searchParams.get("page") ?? "1");
    return isNaN(page) ? 1 : page;
  }, [searchParams, pathname]);

  const {
    data: { anime: continueWatchingAnime, hasNext },
    isLoading,
    error,
  } = api.mal.getContinueWatching.useQuery(
    { page },
    {
      initialData: props.initialData,
    },
  );

  if (isLoading) return <AnimeGridLoader />;

  if (error || !continueWatchingAnime.length) return null;

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
          Continue Watching
        </h1>
        {pathname === "/watching"
          ? hasNext && <Pagination hasNext={hasNext} />
          : continueWatchingAnime.length > 6 && (
              <Button asChild variant={"link"} className="flex gap-2">
                <Link href="/watching">
                  View All
                  <ArrowRight />
                </Link>
              </Button>
            )}
      </div>
      <ul
        className={cn(
          "mb-6 grid h-full grid-cols-2 gap-3 md:grid-cols-6",
          pathname !== "/watching" && "flex flex-col md:grid md:grid-cols-6",
        )}
      >
        {continueWatchingAnime
          ?.slice(
            0,
            pathname === "/watching" ? continueWatchingAnime.length : 6,
          )
          .map((anime) => (
            <li
              key={anime.malAnime.node.id}
              className="group rounded-md border border-border bg-background p-2"
            >
              <Link
                href={`/anime/${anime.animeId}?episode=${anime.lastWatchedEpisode + 1}`}
                className={cn(
                  "flex h-full flex-col gap-3",
                  pathname !== "/watching" && "flex-row md:flex-col",
                )}
              >
                <div
                  className={cn(
                    "relative",
                    pathname !== "/watching" && "w-1/6 md:w-full",
                  )}
                >
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
                  <div
                    className={cn(
                      "pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-muted/70 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100",
                      pathname !== "/watching" && "hidden md:flex",
                    )}
                  >
                    <Play className="h-8 w-8 text-primary" />
                    <p className="mt-2 text-lg font-bold text-foreground">
                      Watch Now
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex flex-1 flex-col justify-between",
                    pathname !== "/watching" &&
                      "justify-center md:justify-between",
                  )}
                >
                  <p
                    className={cn(
                      "line-clamp-2 text-xs transition group-hover:text-primary md:text-sm",
                      pathname !== "/watching" &&
                        "group-hover:text-foreground md:group-hover:text-primary",
                    )}
                  >
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
      {pathname === "/watching"
        ? hasNext && <Pagination hasNext={hasNext} />
        : null}
    </>
  );
};
