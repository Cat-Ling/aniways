import { auth } from '@aniways/auth';
import { createAnimeService, createMyAnimeListService } from '@aniways/data';
import { Skeleton } from '@ui/components/ui/skeleton';
import { cookies } from 'next/headers';
import { Suspense, cache } from 'react';
import { AnimeGrid, AnimeGridLoader } from '../anime-grid';
import { Pagination, PaginationLoader } from '../pagination';
import { AnimeCarousel } from './carousel';

const getRecentlyReleasedAnimes = cache(async (page: number) => {
  const service = createAnimeService();

  return service.getRecentlyReleasedAnimes(page);
});

const Home = async ({ searchParams }: { searchParams: { page: string } }) => {
  const page = Number(searchParams.page || '1');

  return (
    <>
      <Suspense fallback={<Skeleton className="mb-2 h-[430px] md:mb-5" />}>
        <SeasonalAnimeCarousel />
      </Suspense>
      <Suspense fallback={<CurrentlyWatchingAnimeLoader />}>
        <CurrentlyWatchingAnime />
      </Suspense>
      <div
        id={'recently-released'}
        className="mb-6 flex w-full flex-col justify-between gap-3 pt-6 md:mb-5 md:flex-row md:items-center md:gap-0"
      >
        <h1 className="text-lg font-bold md:text-2xl">Recently Released</h1>
        <Suspense fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} />
        </Suspense>
      </div>
      <div className="mb-12">
        <Suspense key={page} fallback={<AnimeGridLoader />}>
          <RecentlyReleasedAnimeGrid page={page} />
        </Suspense>
      </div>
      <div className="-my-6">
        <Suspense fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} />
        </Suspense>
      </div>
    </>
  );
};

const RecentlyReleasedAnimeGrid = async ({ page }: { page: number }) => {
  const { recentlyReleased } = await getRecentlyReleasedAnimes(page);

  return <AnimeGrid animes={recentlyReleased} type="home" />;
};

const PaginationWrapper = async ({ page }: { page: number }) => {
  const { hasNext } = await getRecentlyReleasedAnimes(page);

  return <Pagination hasNext={hasNext} />;
};

const SeasonalAnimeCarousel = async () => {
  const service = createMyAnimeListService();

  const seasonalAnime = await service.getCurrentSeasonAnimes();

  return <AnimeCarousel seasonalAnime={seasonalAnime} />;
};

const CurrentlyWatchingAnimeLoader = () => (
  <>
    <Skeleton className="mb-2 h-[32px] md:mb-5" />
    <div className="mb-12">
      <AnimeGridLoader length={5} />
    </div>
  </>
);

const CurrentlyWatchingAnime = async () => {
  const user = await auth(cookies());

  if (!user) return undefined;

  const {
    accessToken,
    user: { name: username },
  } = user;

  const { getContinueWatchingAnimes } = createAnimeService();

  const newReleases = await getContinueWatchingAnimes(accessToken, username);

  if (!newReleases.length) return undefined;

  return (
    <>
      <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
        Continue Watching
      </h1>
      <div className="mb-6">
        <AnimeGrid animes={newReleases} type="home" />
      </div>
    </>
  );
};

export default Home;
