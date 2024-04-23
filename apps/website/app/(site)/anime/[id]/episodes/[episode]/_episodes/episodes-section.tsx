import { EpisodesSectionClient } from './episodes-section-client';
import { createEpisodeService } from '@aniways/data';

type EpisodesSidbarProps = {
  animeId: string;
  currentEpisode: string;
};

export const EpisodesSection = async ({
  animeId,
  currentEpisode,
}: EpisodesSidbarProps) => {
  const { getEpisodesByAnimeId } = createEpisodeService();

  const videos = await getEpisodesByAnimeId(animeId);

  return (
    <EpisodesSectionClient
      animeId={animeId}
      episodes={videos}
      currentEpisode={currentEpisode}
    />
  );
};
