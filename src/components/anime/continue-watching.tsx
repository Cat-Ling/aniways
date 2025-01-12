"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Pagination } from "../pagination";
import { cn } from "@/lib/utils";
import { AnimeGrid } from "../layouts/anime-grid";

export const ContinueWatching = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    if (pathname !== "/watching") return 1;
    const page = parseInt(searchParams.get("page") ?? "1");
    return isNaN(page) ? 1 : page;
  }, [searchParams, pathname]);

  const [{ anime, hasNext }] = api.mal.getContinueWatching.useSuspenseQuery({
    page,
  });

  if (!anime.length) return null;

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
          Continue Watching
        </h1>
        {pathname === "/watching"
          ? (hasNext || page != 1) && <Pagination hasNext={hasNext} />
          : anime.length > 6 && (
              <Button asChild variant={"link"} className="flex gap-2">
                <Link href="/watching">
                  View All
                  <ArrowRight />
                </Link>
              </Button>
            )}
      </div>
      <AnimeGrid
        className={cn(
          "mb-6",
          pathname !== "/watching" && "flex flex-col md:grid md:grid-cols-6",
        )}
      >
        {anime
          ?.slice(0, pathname === "/watching" ? anime.length : 6)
          .map((anime) => (
            <AnimeGrid.Item
              key={anime.malAnime.node.id}
              poster={anime.malAnime.node.main_picture.large ?? ""}
              title={anime.malAnime.node.title ?? "???"}
              url={`/anime/${anime.animeId}?episode=${anime.lastWatchedEpisode + 1}`}
              subtitle={`Episode ${anime.lastWatchedEpisode + 1}`}
              type={pathname === "/watching" ? "vertical" : "horizontal"}
            />
          ))}
      </AnimeGrid>
      {pathname === "/watching"
        ? (hasNext || page != 1) && <Pagination hasNext={hasNext} />
        : null}
    </>
  );
};
