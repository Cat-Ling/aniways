"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

const AnimeStreamingPage = () => {
  const { id, number } = useParams<{ id: string; number: string }>();

  const { data: sources, isLoading } = api.hiAnime.getEpisodeSources.useQuery({
    id,
    episode: Number(number),
  });

  if (isLoading) {
    return (
      <div className="mb-2 flex-1">
        <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
      </div>
    );
  }

  return (
    <div className="mb-2 flex-1">
      <pre className="w-full text-wrap">{JSON.stringify(sources, null, 2)}</pre>
      {/* <Suspense
          fallback={
            <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
          }
        >
          <VideoPlayer
            animeId={id}
            malId={anime.malAnimeId}
            episode={episode}
            nextEpisode={
              nextEpisode
                ? `/anime/${id}/episodes/${nextEpisode.episode}`
                : null
            }
          />
        </Suspense> */}
    </div>
  );
};

export default AnimeStreamingPage;
