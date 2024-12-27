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

type PlanToWatchProps = {
  initialData: RouterOutputs["mal"]["getPlanToWatch"];
};

export const PlanToWatch = (props: PlanToWatchProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    if (pathname !== "/anime/plan-to-watch") return 1;
    const page = parseInt(searchParams.get("page") ?? "1");
    return isNaN(page) ? 1 : page;
  }, [searchParams, pathname]);

  const {
    data: { anime: planToWatchAnime, hasNext },
    isLoading,
    error,
  } = api.mal.getPlanToWatch.useQuery(
    { page },
    {
      initialData: props.initialData,
    },
  );

  if (isLoading) return <AnimeGridLoader />;

  if (error || !planToWatchAnime.length) return null;

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
          Your Plan to Watch
        </h1>
        {pathname === "/anime/plan-to-watch"
          ? hasNext && <Pagination hasNext={hasNext} />
          : planToWatchAnime.length > 6 && (
              <Button asChild variant={"link"} className="flex gap-2">
                <Link href="/anime/plan-to-watch">
                  View All
                  <ArrowRight />
                </Link>
              </Button>
            )}
      </div>
      <ul className="mb-6 grid h-full grid-cols-2 gap-3 md:grid-cols-6">
        {planToWatchAnime
          ?.slice(
            0,
            pathname === "/anime/plan-to-watch" ? planToWatchAnime.length : 6,
          )
          .map((anime) => (
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
      {pathname === "/anime/plan-to-watch"
        ? hasNext && <Pagination hasNext={hasNext} />
        : null}
    </>
  );
};
