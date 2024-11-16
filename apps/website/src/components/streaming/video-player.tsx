import { notFound } from "next/navigation";

import { api } from "~/trpc/server";

import "./streaming.css";

import { env } from "~/env";
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
      streamingSources={{
        ...streamingSources,
        sources: streamingSources.sources.map(source => ({
          ...source,
          url:
            env.NODE_ENV === "development" ?
              "http://localhost:4545/" + encodeURIComponent(source.url)
            : `https://streaming.aniways.xyz/${encodeURIComponent(source.url)}`,
        })),
      }}
      nextEpisodeUrl={nextEpisode}
      episode={Number(episode)}
      malId={malId}
    />
  );
};
