import { ContinueWatching as ContinueWatchingClient } from "@/components/anime/continue-watching";
import { PlanToWatch as PlanToWatchClient } from "@/components/anime/plan-to-watch";
import { TrendingAnime as TrendingAnimeClient } from "@/components/anime/trending-anime";
import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/server";
import { Suspense, type ReactNode } from "react";
import {
  SeasonalAnimeCarousel,
  SeasonalAnimeCarouselLoader,
} from "@/components/anime/carousel";

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <Suspense fallback={<SeasonalAnimeCarouselLoader />}>
        <SeasonalAnimeCarousel />
      </Suspense>
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-2 h-7 w-60 font-bold md:mb-5 md:h-8" />
            <div className="mb-6">
              <AnimeGridLoader length={6} />
            </div>
          </>
        }
      >
        <TrendingAnime />
      </Suspense>
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-2 h-7 w-60 font-bold md:mb-5 md:h-8" />
            <div className="mb-6">
              <AnimeGridLoader length={6} />
            </div>
          </>
        }
      >
        <ContinueWatching />
      </Suspense>
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-2 h-7 w-60 font-bold md:mb-5 md:h-8" />
            <div className="mb-6">
              <AnimeGridLoader length={6} />
            </div>
          </>
        }
      >
        <PlanToWatch />
      </Suspense>
      {children}
    </>
  );
};

const TrendingAnime = async () => {
  const trendingAnime = await api.hiAnime.getTrendingAnime();

  return <TrendingAnimeClient trendingAnime={trendingAnime} />;
};

const ContinueWatching = async () => {
  const initalData = await api.mal
    .getContinueWatching({ page: 1 })
    .catch(() => null);

  if (!initalData) return null;

  return <ContinueWatchingClient initialData={initalData} />;
};

const PlanToWatch = async () => {
  const initalData = await api.mal
    .getPlanToWatch({ page: 1 })
    .catch(() => null);

  if (!initalData) return null;

  return <PlanToWatchClient initialData={initalData} />;
};

export default HomeLayout;
