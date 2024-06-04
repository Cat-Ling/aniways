import { createAnimeService, createMyAnimeListService } from '@aniways/data';
import { auth } from '@aniways/auth';
import { Skeleton } from '@aniways/ui/components/ui/skeleton';
import { cookies } from 'next/headers';
import { ReactNode, Suspense } from 'react';
import { AnimeGrid, AnimeGridLoader } from '../anime-grid';
import { AnimeCarousel } from './carousel';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

type HomeLayoutProps = {
  children: ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <ErrorBoundary
        errorComponent={() => <Skeleton className="mb-2 h-[430px] md:mb-5" />}
      >
        <Suspense fallback={<Skeleton className="mb-2 h-[430px] md:mb-5" />}>
          <SeasonalAnimeCarousel />
        </Suspense>
      </ErrorBoundary>
      <Suspense fallback={<CurrentlyWatchingAnimeLoader />}>
        <CurrentlyWatchingAnime />
      </Suspense>
      {children}
    </>
  );
}

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
