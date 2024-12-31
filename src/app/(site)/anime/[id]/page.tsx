import { Player as PlayerClient } from "@/components/streaming/player";
import { Skeleton } from "@/components/ui/skeleton";
import { HiAnimeScraper } from "@/server/hianime";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";

type AnimeStreamingPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ episode: string | undefined }>;
};

const AnimeStreamingPage = async ({
  params,
  searchParams,
}: AnimeStreamingPageProps) => {
  const [{ id }, episode] = await Promise.all([
    params,
    searchParams.then((searchParams) => Number(searchParams.episode ?? 1)),
  ]);

  return (
    <div className="mb-2 flex-1">
      <Suspense
        key={episode}
        fallback={
          <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
        }
      >
        <Player id={id} episode={episode} />
      </Suspense>
    </div>
  );
};

const getSources = unstable_cache(
  (id: string, episode: number) => {
    return new HiAnimeScraper().getEpisodeSrc(id, episode);
  },
  ["sources"],
  {
    revalidate: 60 * 60 * 24, // 1 day
  },
);

type PlayerProps = {
  id: string;
  episode: number;
};

const Player = async ({ id, episode }: PlayerProps) => {
  const sources = await getSources(id, episode);

  if (sources.nextEpisode) {
    void getSources(id, sources.nextEpisode);
  }

  return (
    <PlayerClient sources={sources} animeId={id} currentEpisode={episode} />
  );
};

export default AnimeStreamingPage;
