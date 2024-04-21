import { EpisodesSectionClient } from './episodes-section-client';
import { getVideosByAnimeId } from '@aniways/data';

type EpisodesSidbarProps = {
  animeId: string;
  currentEpisode: string;
};

export const EpisodesSection = async ({
  animeId,
  currentEpisode,
}: EpisodesSidbarProps) => {
  const videos = await getVideosByAnimeId(animeId);

  return (
    <EpisodesSectionClient
      animeId={animeId}
      episodes={videos}
      currentEpisode={currentEpisode}
    />
  );
};
