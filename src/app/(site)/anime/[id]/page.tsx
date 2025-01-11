"use client";

import { Player } from "@/components/streaming/player";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo } from "react";

const AnimeStreamingPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentEpisode = useMemo(() => {
    const ep = searchParams.get("episode") ?? 1;
    return Number(ep);
  }, [searchParams]);

  const { data: sources, isLoading } = api.hiAnime.getEpisodeSources.useQuery(
    {
      id,
      episode: currentEpisode,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const utils = api.useUtils();

  useEffect(() => {
    const nextEpisode = sources?.nextEpisode;
    if (!nextEpisode) return;
    void utils.hiAnime.getEpisodeSources.prefetch({ id, episode: nextEpisode });
  }, [sources, id, utils]);

  useEffect(() => {
    if (!Number.isNaN(currentEpisode)) return;
    router.replace(`${pathname}?episode=1`);
  }, [currentEpisode, router, pathname]);

  if (isLoading || !sources) {
    return (
      <div className="mb-2 flex-1">
        <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
      </div>
    );
  }

  return (
    <div className="mb-2 flex-1">
      <Player animeId={id} currentEpisode={currentEpisode} sources={sources} />
    </div>
  );
};

export default AnimeStreamingPage;
