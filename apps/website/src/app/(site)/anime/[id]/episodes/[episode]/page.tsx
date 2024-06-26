import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";

import { createAnimeService } from "@aniways/data";
import { Skeleton } from "@aniways/ui/skeleton";

import { EpisodesSection } from "./_episodes";
import { VideoFrame } from "./video-frame";

const getAnimeById = cache(async (id: string) => {
  const service = createAnimeService();

  return await service.getAnimeById(id);
});

export const generateMetadata = async ({
  params: { id, episode },
}: {
  params: {
    id: string;
    episode: string;
  };
}): Promise<Metadata> => {
  episode = episode.replace("-", ".");

  const data = await getAnimeById(id);

  if (!data?.title) return {};

  return {
    title: `${data.title} - Episode ${episode}`,
    description: `Watch ${data.title} episode ${episode} online for free.`,
    openGraph: {
      title: `${data.title} - Episode ${episode}`,
      description: `Watch ${data.title} episode ${episode} online for free.`,
      type: "video.episode",
      siteName: "Aniways",
      images: [
        {
          url: data.image,
          alt: `${data.title} - Episode ${episode}`,
        },
      ],
    },
  };
};

const AnimeStreamingPage = async ({
  params: { id, episode },
}: {
  params: {
    id: string;
    episode: string;
  };
}) => {
  episode = episode.replace("-", ".");

  const anime = await getAnimeById(id);

  if (!anime) notFound();

  return (
    <>
      <div className="mb-3">
        <h1 className="text-xl font-bold">{anime.title}</h1>
        <h2 className="text-lg font-normal text-muted-foreground">
          Episode {episode}
        </h2>
      </div>
      <div className="mb-5 flex aspect-video w-full flex-col gap-2">
        <div className="flex-1">
          <Suspense
            fallback={
              <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
            }
          >
            <VideoFrame animeId={id} currentEpisode={episode} />
          </Suspense>
        </div>
        <Suspense
          fallback={
            <>
              <Skeleton className="mb-6 mt-3 h-10 w-full" />
              <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
              <Skeleton className="mb-6 h-10 w-full" />
            </>
          }
        >
          <EpisodesSection animeId={id} currentEpisode={episode} />
        </Suspense>
      </div>
    </>
  );
};

export default AnimeStreamingPage;
