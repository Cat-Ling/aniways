"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { Loader2, Play, Shell } from "lucide-react";

import type { RouterInputs, RouterOutputs } from "@/trpc/react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/trpc/react";
import { AnimeGridLoader } from "../layouts/anime-grid-loader";

type Status = RouterInputs["mal"]["getAnimeListOfUser"]["status"];

interface AnimeListClientProps {
  initialData: RouterOutputs["mal"]["getAnimeListOfUser"];
  status: Status;
}

function convertStatus(status: Status) {
  return status
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
}

export const MalClient = ({ initialData, status }: AnimeListClientProps) => {
  const {
    data: animeList,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = api.mal.getAnimeListOfUser.useInfiniteQuery(
    {
      status,
    },
    {
      initialData: {
        pageParams: [1],
        pages: [initialData],
      },
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNext ? pages.length + 1 : undefined,
    },
  );

  const observerRef = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
          void fetchNextPage();
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (node) observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching],
  );

  if (!animeList) {
    return <AnimeGridLoader />;
  }

  if (!animeList.pages[0]?.anime.length) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 p-3">
        <Shell className="text-primary" size={128} />
        <h2 className="text-3xl font-bold">No Anime {convertStatus(status)}</h2>
        <p className="text-center text-muted-foreground">
          There are no anime in your list with the status{" "}
          <span className="text-foreground">{convertStatus(status)}</span>. Try
          changing the status or adding some anime to your list.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid h-full grid-cols-2 gap-3 md:grid-cols-6">
      {animeList.pages.map((page) =>
        page.anime.map((anime) => {
          const url = anime.hiAnimeId
            ? `/anime/${anime.hiAnimeId}`
            : `/search?query=${anime.title}`;

          return (
            <li
              key={anime.id}
              ref={lastElementRef}
              className="group rounded-md border border-border bg-background p-2"
            >
              <Link href={url} className="flex h-full flex-col gap-3">
                <div className="relative">
                  <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                    <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                    <Image
                      src={anime.main_picture.large}
                      alt={anime.title}
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
                    {anime.title}
                  </p>
                  <div className="flex w-full justify-between">
                    <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                      {convertStatus(
                        anime.my_list_status?.status ?? "plan_to_watch",
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                      {anime.my_list_status?.num_episodes_watched ?? 0} of{" "}
                      {anime.num_episodes || "???"}ep
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        }),
      )}
      {hasNextPage && (
        <li className="col-span-2 flex items-center justify-center md:col-span-6">
          <Button
            onClick={() => !isFetching && fetchNextPage()}
            variant={"ghost"}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span className="ml-2">Loading...</span>
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </li>
      )}
    </ul>
  );
};
