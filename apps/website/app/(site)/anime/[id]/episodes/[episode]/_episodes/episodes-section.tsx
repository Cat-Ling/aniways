import { db, orm, schema } from '@aniways/database';
import { EpisodesSectionClient } from './episodes-section-client';

type EpisodesSidbarProps = {
  anime: schema.Anime;
  currentEpisode: string;
};

export const EpisodesSection = async ({
  anime,
  currentEpisode,
}: EpisodesSidbarProps) => {
  const videos = await db
    .selectDistinctOn([schema.video.episode])
    .from(schema.video)
    .where(orm.eq(schema.video.animeId, anime.id))
    .orderBy(orm.asc(schema.video.episode));

  return (
    <EpisodesSectionClient
      anime={anime}
      episodes={videos}
      currentEpisode={currentEpisode}
    />
  );
};
