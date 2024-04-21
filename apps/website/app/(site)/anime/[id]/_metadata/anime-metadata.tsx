import { auth } from '@aniways/auth';
import { cookies } from 'next/headers';
import { MetadataProvider } from './metadata-provider';
import { AnimeMetadataClient } from './anime-metadata-client';
import { Suspense } from 'react';
import { AnimeGridLoader } from '../../../anime-grid';
import { RelatedAnime } from './related-anime';
import { getAnimeById, getAnimeMetadataFromMAL } from '@aniways/data';
import { notFound } from 'next/navigation';

type AnimeMetadataProps = {
  id: string;
};

export const AnimeMetadata = async ({ id }: AnimeMetadataProps) => {
  const anime = await getAnimeById(id);

  if (!anime) notFound();

  const user = await auth(cookies());

  const details = await getAnimeMetadataFromMAL(user?.accessToken, anime).catch(
    err => {
      if (err === getAnimeMetadataFromMAL.NOT_FOUND) notFound();
      throw err;
    }
  );

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
