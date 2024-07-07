"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { RouterOutputs } from "@aniways/trpc";
import { cn } from "@aniways/ui";
import { Button } from "@aniways/ui/button";

interface EpisodesSidbarProps {
  animeId: string;
  episodes: RouterOutputs["episodes"]["getEpisodesOfAnime"];
  currentEpisode: string;
}

export const EpisodesSection = ({
  animeId,
  episodes,
  currentEpisode,
}: EpisodesSidbarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef<HTMLButtonElement>(null);

  const nextEpisode = useMemo(() => {
    const currentIndex = episodes.findIndex(
      video => video.episode === currentEpisode
    );

    return episodes.at(currentIndex + 1);
  }, [currentEpisode, episodes]);

  const prevEpisode = useMemo(() => {
    const currentIndex = episodes.findIndex(
      video => video.episode === currentEpisode
    );

    if (currentIndex === 0) return null;

    return episodes.at(currentIndex - 1);
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
        {prevEpisode ?
          <Button className="flex items-center gap-2" asChild>
            <Link href={`/anime/${animeId}/episodes/${prevEpisode.episode}`}>
              <ChevronLeftIcon className="h-5 w-5" />
              Previous
            </Link>
          </Button>
        : <div></div>}
        {nextEpisode && (
          <Button className="flex items-center gap-2" asChild>
            <Link href={`/anime/${animeId}/episodes/${nextEpisode.episode}`}>
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
        {episodes.map(video => {
          const isCurrentVideo =
            String(currentEpisode) === String(video.episode);

          return (
            <Button
              key={video.id}
              ref={isCurrentVideo ? currentVideoRef : null}
              variant={isCurrentVideo ? "default" : "secondary"}
              asChild={!isCurrentVideo}
              disabled={isCurrentVideo}
              className={cn(isCurrentVideo && "!opacity-100")}
            >
              {isCurrentVideo ?
                `Episode ${video.episode}`
              : <Link href={`/anime/${animeId}/episodes/${video.episode}`}>
                  Episode {video.episode}
                </Link>
              }
            </Button>
          );
        })}
      </div>
    </div>
  );
};
