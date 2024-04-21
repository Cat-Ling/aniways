import { auth } from '@aniways/myanimelist';
import { db, schema, orm } from '@aniways/database';
import { getAnimeDetailsFromMyAnimeList } from '@aniways/myanimelist';
import { cookies } from 'next/headers';
import { MetadataProvider } from './metadata-provider';
import { AnimeMetadataClient } from './anime-metadata-client';
import { Suspense } from 'react';
import { AnimeGridLoader } from '../../../anime-grid';
import { RelatedAnime } from './related-anime';
import { getAnimeById } from '@aniways/data';
import { notFound } from 'next/navigation';

type AnimeMetadataProps = {
  id: string;
};

export const AnimeMetadata = async ({ id }: AnimeMetadataProps) => {
  const anime = await getAnimeById(id);

  if (!anime) notFound();

  const user = await auth(cookies());

  const details = await getAnimeDetailsFromMyAnimeList({
    accessToken: user?.accessToken,
    ...(anime.malAnimeId ?
      { malId: anime.malAnimeId }
    : { title: anime.title }),
  });

  if (!anime.malAnimeId && details?.mal_id) {
    await db
      .update(schema.anime)
      .set({ malAnimeId: details.mal_id })
      .where(orm.eq(schema.anime.id, anime.id));
  }

  if (!details || !details.mal_id) return null;

  return (
    <MetadataProvider metadata={details}>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <AnimeMetadataClient anime={anime} />
      <Suspense fallback={<AnimeGridLoader />}>
        <RelatedAnime details={details} />
      </Suspense>
    </MetadataProvider>
  );
};
