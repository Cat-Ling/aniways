"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { RouterOutputs } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface EpisodesSidbarProps {
  animeId: string;
  episodes: RouterOutputs["hiAnime"]["getEpisodes"];
}

export const EpisodesSection = ({ animeId, episodes }: EpisodesSidbarProps) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef<HTMLButtonElement>(null);

  const currentEpisode = useMemo(() => {
    const match = /episodes\/(\d+)/.exec(pathname);
    return match ? match[1] : null;
  }, [pathname]);

  const nextEpisode = useMemo(() => {
    const currentIndex = episodes.episodes.findIndex(
      (ep) => ep.number === Number(currentEpisode),
    );

    if (currentIndex === episodes.episodes.length - 1) return null;

    return episodes.episodes[currentIndex + 1];
  }, [currentEpisode, episodes]);

  const prevEpisode = useMemo(() => {
    const currentIndex = episodes.episodes.findIndex(
      (ep) => ep.number === Number(currentEpisode),
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

  return (
    <div className="mt-3">
      <div className="mb-6 flex w-full justify-between">
        {prevEpisode ? (
          <Button className="flex items-center gap-2" asChild>
            <Link href={`/anime/${animeId}/episodes/${prevEpisode.number}`}>
              <ChevronLeftIcon className="h-5 w-5" />
              Previous
            </Link>
          </Button>
        ) : (
          <div></div>
        )}
        {nextEpisode && (
          <Button className="flex items-center gap-2" asChild>
            <Link href={`/anime/${animeId}/episodes/${nextEpisode.number}`}>
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
          const isCurrentVideo = Number(currentEpisode) === video.number;

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
                <Link href={`/anime/${animeId}/episodes/${video.number}`}>
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
