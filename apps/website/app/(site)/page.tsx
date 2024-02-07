import { Pagination } from './pagination';
import { Suspense } from 'react';
import { getRecentlyReleasedAnime } from '@aniways/data-access';
import { AnimeGridLoader } from './anime-grid-loader';
import { AnimeGrid } from './anime-grid';
import { PaginationLoader } from './pagination-loader';
import { unstable_cache } from 'next/cache';

const FIFTEEN_MINUTES_IN_SECONDS = 60 * 15;

const cachedRecentlyReleasedAnime = unstable_cache(
  getRecentlyReleasedAnime,
  ['recently-released-anime'],
  {
    tags: ['recently-released-anime'],
    revalidate: FIFTEEN_MINUTES_IN_SECONDS,
  }
);

const Home = async ({ searchParams }: { searchParams: { page: string } }) => {
  const page = Number(searchParams.page || '1');

  return (
    <>
      <div className="mb-5 flex w-full flex-row items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Recently Released</h1>
        <Suspense key={page + '-pagination'} fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} />
        </Suspense>
      </div>
      <Suspense key={page} fallback={<AnimeGridLoader />}>
        <RecentlyReleasedAnimeGrid page={page} />
      </Suspense>
    </>
  );
};

const RecentlyReleasedAnimeGrid = async ({ page }: { page: number }) => {
  const { anime } = await cachedRecentlyReleasedAnime(page);

  return <AnimeGrid anime={anime} type="home" />;
};

const PaginationWrapper = async ({ page }: { page: number }) => {
  const { hasNext } = await cachedRecentlyReleasedAnime(page);

  return <Pagination hasNext={hasNext} />;
};

export default Home;
