'use client';

import { schema } from '@aniways/database';
import { Button } from '@ui/components/ui/button';
import { cn } from '@ui/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

type EpisodesSidbarProps = {
  anime: schema.Anime;
  episodes: schema.Video[];
  currentEpisode: string;
};

export const EpisodesSectionClient = ({
  anime,
  episodes,
  currentEpisode,
}: EpisodesSidbarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!currentVideoRef.current) return;
    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    const currentVideoRect = currentVideoRef.current.getBoundingClientRect();

    if (!sidebarRect || !currentVideoRect) return;

    const scrollTop = currentVideoRect.top - sidebarRect.top - 250;

    sidebarRef.current?.scrollTo({
      top: scrollTop,
      behavior: 'instant',
    });
  }, [sidebarRef, currentVideoRef, currentEpisode]);

  return (
    <div className="mt-3">
      <div className="mb-6 flex w-full justify-between">
        {Number(currentEpisode) > 1 ?
          <Button className="flex items-center gap-2" asChild>
            <Link
              href={`/anime/${anime.id}/episodes/${Number(currentEpisode) - 1}`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              Previous
            </Link>
          </Button>
        : <div></div>}
        {Number(currentEpisode) < episodes.length && (
          <Button className="flex items-center gap-2" asChild>
            <Link
              href={`/anime/${anime.id}/episodes/${Number(currentEpisode) + 1}`}
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
        className="grid h-fit max-h-[500px] w-full grid-cols-3 gap-2 overflow-scroll rounded-md sm:grid-cols-6 md:grid-cols-12"
      >
        {episodes.map(video => {
          const isCurrentVideo =
            String(currentEpisode) === String(video.episode);

          return (
            <Button
              key={video.id}
              ref={isCurrentVideo ? currentVideoRef : null}
              variant={isCurrentVideo ? 'default' : 'secondary'}
              asChild={!isCurrentVideo}
              disabled={isCurrentVideo}
              className={cn(isCurrentVideo && '!opacity-100')}
            >
              {isCurrentVideo ?
                `Episode ${video.episode}`
              : <Link href={`/anime/${anime.id}/episodes/${video.episode}`}>
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
