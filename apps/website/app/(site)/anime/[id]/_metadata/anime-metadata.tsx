import { auth } from '@aniways/auth';
import { cookies } from 'next/headers';
import { MetadataProvider } from './metadata-provider';
import { AnimeMetadataClient } from './anime-metadata-client';
import { Suspense } from 'react';
import { AnimeGridLoader } from '../../../anime-grid';
import { RelatedAnime } from './related-anime';
import {
  MyAnimeListService,
  createAnimeService,
  createMyAnimeListService,
} from '@aniways/data';
import { notFound } from 'next/navigation';

type AnimeMetadataProps = {
  id: string;
};

export const AnimeMetadata = async ({ id }: AnimeMetadataProps) => {
  const { getAnimeById } = createAnimeService();

  const anime = await getAnimeById(id);

  if (!anime) notFound();

  const user = await auth(cookies());

  const { syncAndGetAnimeMetadataFromMyAnimeList } = createMyAnimeListService();

  const details = await syncAndGetAnimeMetadataFromMyAnimeList(
    user?.accessToken,
    anime
  ).catch(err => {
    if (err === MyAnimeListService.NOT_FOUND) notFound();
    throw err;
  });

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
