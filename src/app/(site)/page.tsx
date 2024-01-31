import { Pagination } from './pagination';
import { Suspense } from 'react';
import { getAnimeFromAllAnime } from '@/data-access/anime';
import { AnimeGridLoader } from './anime-grid-loader';
import { AnimeGrid } from './anime-grid';
import { PaginationLoader } from './pagination-loader';

const Home = async ({ searchParams }: { searchParams: { page: string } }) => {
  const page = Number(searchParams.page || '1');

  return (
    <>
      <div className="w-full flex justify-between mb-5 items-center">
        <h1 className="text-2xl font-bold">Recently Released</h1>
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
  const { anime } = await getAnimeFromAllAnime(page);

  return <AnimeGrid anime={anime} />;
};

const PaginationWrapper = async ({ page }: { page: number }) => {
  const { next } = await getAnimeFromAllAnime(page);

  return <Pagination hasNext={!!next} />;
};

export default Home;
