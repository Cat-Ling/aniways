import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Skeleton } from "@aniways/ui/skeleton";

import { VideoPlayer } from "~/components/streaming/video-frame";
import { getAnimeById, getEpisodesOfAnime } from "./cache";

export const generateMetadata = async ({
  params: { id, episode },
}: {
  params: {
    id: string;
    episode: string;
  };
}): Promise<Metadata> => {
  episode = episode.replace("-", ".");

  const data = await getAnimeById({ id });

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

  const anime = await getAnimeById({ id });

  if (!anime) notFound();

  const episodes = await getEpisodesOfAnime({ animeId: id });

  const currentEpisodeIndex = episodes.findIndex(ep => ep.episode === episode);

  const nextEpisode = episodes.at(currentEpisodeIndex + 1) ?? null;

  return (
    <>
      <div className="mb-3">
        <h1 className="text-xl font-bold">{anime.title}</h1>
        <h2 className="text-lg font-normal text-muted-foreground">
          Episode {episode}
        </h2>
      </div>
      <div className="mb-2 flex-1">
        <Suspense
          fallback={
            <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
          }
        >
          <VideoPlayer
            animeId={id}
            episode={episode}
            nextEpisode={
              nextEpisode ?
                `/anime/${id}/episodes/${nextEpisode.episode}`
              : null
            }
          />
        </Suspense>
      </div>
    </>
  );
};

export default AnimeStreamingPage;
