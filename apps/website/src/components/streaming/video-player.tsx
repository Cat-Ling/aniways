import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import { VideoPlayerClient } from "./player";

interface VideoFrameProps {
  episode: string;
  animeId: string;
  nextEpisode: string | null;
  malId: number | null;
}

export const VideoPlayer = async ({
  animeId,
  episode,
  nextEpisode,
  malId,
}: VideoFrameProps) => {
  const streamingSources = await api.episodes
    .getStreamingSources({
      animeId,
      episode,
    })
    .catch(() => {
      notFound();
    });

  return (
    <VideoPlayerClient
      streamingSources={streamingSources}
      nextEpisodeUrl={nextEpisode}
      episode={Number(episode)}
      malId={malId}
    />
  );
};
