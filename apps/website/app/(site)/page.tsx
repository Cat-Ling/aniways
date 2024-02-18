import { retreiveRecentlyReleasedAnime } from '@aniways/database';
import { Suspense } from 'react';
import { AnimeGrid } from './anime-grid';
import { AnimeGridLoader } from './anime-grid-loader';
import { Pagination } from './pagination';
import { PaginationLoader } from './pagination-loader';

const Home = async ({ searchParams }: { searchParams: { page: string } }) => {
  const page = Number(searchParams.page || '1');

  return (
    <>
      <div className="mb-2 flex w-full flex-col justify-between gap-2 md:mb-5 md:flex-row md:items-center md:gap-0">
        <h1 className="text-lg font-bold md:text-2xl">Recently Released</h1>
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
  const { recentlyReleased } = await retreiveRecentlyReleasedAnime(page);

  return <AnimeGrid animes={recentlyReleased} type="home" />;
};

const PaginationWrapper = async ({ page }: { page: number }) => {
  const { hasNext } = await retreiveRecentlyReleasedAnime(page);

  return <Pagination hasNext={hasNext} />;
};

export default Home;
