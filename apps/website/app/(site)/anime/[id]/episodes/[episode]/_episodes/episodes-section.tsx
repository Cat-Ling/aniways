import { db, orm, schema } from '@aniways/database';
import { EpisodesSectionClient } from './episodes-section-client';

type EpisodesSidbarProps = {
  animeId: string;
  currentEpisode: string;
};

export const EpisodesSection = async ({
  animeId,
  currentEpisode,
}: EpisodesSidbarProps) => {
  const videos = await db
    .selectDistinctOn([schema.video.episode])
    .from(schema.video)
    .where(orm.eq(schema.video.animeId, animeId))
    .orderBy(orm.asc(schema.video.episode));

  return (
    <EpisodesSectionClient
      animeId={animeId}
      episodes={videos}
      currentEpisode={currentEpisode}
    />
  );
};
