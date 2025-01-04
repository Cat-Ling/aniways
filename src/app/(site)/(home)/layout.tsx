import {
  SeasonalAnimeCarousel,
  SeasonalAnimeCarouselLoader,
} from "@/components/anime/carousel";
import { ContinueWatching as ContinueWatchingClient } from "@/components/anime/continue-watching";
import { GenreMenu } from "@/components/anime/genre-menu";
import { PlanToWatch as PlanToWatchClient } from "@/components/anime/plan-to-watch";
import { TopAnime as TopAnimeClient } from "@/components/anime/top-anime";
import { TrendingAnime as TrendingAnimeClient } from "@/components/anime/trending-anime";
import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/server";
import { Suspense, type ReactNode } from "react";

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
        fallback={Array.from({ length: 3 }).map((_, i) => (
          <AnimeLoader key={i} />
        ))}
      >
        <TrendingAnime />
        <ContinueWatching />
        <PlanToWatch />
      </Suspense>
      <div className="w-full md:grid md:grid-cols-4">
        <section className="col-span-3">{children}</section>
        <section className="flex flex-col justify-start gap-6 pl-2 md:flex-col-reverse md:justify-end">
          <Suspense
            fallback={<Skeleton className="h-[1000px] w-full rounded-md" />}
          >
            <TopAnime />
          </Suspense>
          <Suspense
            fallback={<Skeleton className="h-[500px] w-full rounded-md" />}
          >
            <Genres />
          </Suspense>
        </section>
      </div>
    </>
  );
};

const AnimeLoader = () => {
  return (
    <>
      <Skeleton className="mb-2 h-7 w-60 font-bold md:mb-5 md:h-8" />
      <div className="mb-6">
        <AnimeGridLoader length={6} />
      </div>
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

const TopAnime = async () => {
  const topAnime = await api.hiAnime.getTopAnime();

  return <TopAnimeClient topAnime={topAnime} />;
};

const Genres = async () => {
  const genres = await api.hiAnime.getGenres();

  return <GenreMenu genres={genres} />;
};

export default HomeLayout;
