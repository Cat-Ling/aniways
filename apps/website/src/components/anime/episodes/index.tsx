import { api } from "~/trpc/server";
import { EpisodesSectionClient } from "./episodes-section-client";

interface EpisodesSidbarProps {
  animeId: string;
  currentEpisode: string;
}

export const EpisodesSection = async ({
  animeId,
  currentEpisode,
}: EpisodesSidbarProps) => {
  const videos = await api.episodes.getEpisodesOfAnime({ animeId });

  return (
    <EpisodesSectionClient
      animeId={animeId}
      episodes={videos}
      currentEpisode={currentEpisode}
    />
  );
};
