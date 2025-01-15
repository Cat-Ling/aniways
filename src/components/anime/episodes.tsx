"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { RouterOutputs } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface EpisodesSidbarProps {
  animeId: string;
  episodes: RouterOutputs["hiAnime"]["getEpisodes"];
}

export const EpisodesSection = ({ animeId, episodes }: EpisodesSidbarProps) => {
  const searchParams = useSearchParams();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef<HTMLButtonElement>(null);

  const currentEpisode = useMemo(() => {
    const ep = searchParams.get("episode");
    const firstEp = episodes.episodes[0]?.number;

    const currentEpisode = Number(ep ?? firstEp ?? 1);

    if (!episodes.episodes.find((ep) => ep.number === currentEpisode)) {
      return firstEp ?? 1;
    }

    return Number(ep ?? firstEp ?? 1);
  }, [episodes, searchParams]);

  const nextEpisode = useMemo(() => {
    const currentIndex = episodes.episodes.findIndex(
      (ep) => ep.number === currentEpisode,
    );

    if (currentIndex === episodes.episodes.length - 1) return null;

    return episodes.episodes[currentIndex + 1];
  }, [currentEpisode, episodes]);

  const prevEpisode = useMemo(() => {
    const currentIndex = episodes.episodes.findIndex(
      (ep) => ep.number === currentEpisode,
    );

    if (currentIndex === 0) return null;

    return episodes.episodes[currentIndex - 1];
  }, [currentEpisode, episodes]);

  useEffect(() => {
    if (!currentVideoRef.current) return;
    if (!sidebarRef.current) return;

    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const currentVideoRect = currentVideoRef.current.getBoundingClientRect();

    const scrollTop = currentVideoRect.top - sidebarRect.top - 250;

    sidebarRef.current.scrollTo({
      top: scrollTop,
      behavior: "instant",
    });
  }, [sidebarRef, currentVideoRef, currentEpisode]);

  useEffect(() => {
    const ep = searchParams.get("episode") ?? undefined;
    if (Number(ep) === currentEpisode) return;
    window.history.replaceState(null, "", `?episode=${currentEpisode}`);
  }, [searchParams, currentEpisode]);

  return (
    <div className="mt-3">
      <div className="mb-6 flex w-full justify-between">
        {prevEpisode ? (
          <Button className="flex items-center gap-2" asChild>
            <Link
              href={`/anime/${animeId}?episode=${prevEpisode.number}`}
              scroll={false}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              Previous
            </Link>
          </Button>
        ) : (
          <div></div>
        )}
        {nextEpisode && (
          <Button className="flex items-center gap-2" asChild>
            <Link
              href={`/anime/${animeId}?episode=${nextEpisode.number}`}
              scroll={false}
            >
              Next
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
      <h3 className="mb-3 text-lg font-semibold">Episodes</h3>
      <div
        ref={sidebarRef}
        className="grid h-fit max-h-[500px] w-full grid-cols-3 gap-2 overflow-scroll rounded-md sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12"
      >
        {episodes.episodes.map((video) => {
          const isCurrentVideo = currentEpisode === video.number;

          return (
            <Button
              key={video.episodeId}
              ref={isCurrentVideo ? currentVideoRef : null}
              variant={isCurrentVideo ? "default" : "secondary"}
              asChild={!isCurrentVideo}
              disabled={isCurrentVideo}
              className={cn(isCurrentVideo && "!opacity-100")}
            >
              {isCurrentVideo ? (
                `Episode ${video.number}`
              ) : (
                <Link
                  href={`/anime/${animeId}?episode=${video.number}`}
                  scroll={false}
                >
                  Episode {video.number}
                </Link>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
