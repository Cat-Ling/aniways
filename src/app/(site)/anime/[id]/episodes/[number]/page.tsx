"use client";

import { Player } from "@/components/streaming/player";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

const AnimeStreamingPage = () => {
  const { id, number } = useParams<{ id: string; number: string }>();

  const { data: sources, isLoading } = api.hiAnime.getEpisodeSources.useQuery(
    {
      id,
      episode: Number(number),
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  if (isLoading || !sources) {
    return (
      <div className="mb-2 flex-1">
        <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
      </div>
    );
  }

  return (
    <div className="mb-2 flex-1">
      <Player sources={sources} />
    </div>
  );
};

export default AnimeStreamingPage;
