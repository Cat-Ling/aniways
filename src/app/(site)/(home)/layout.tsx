import {
  SeasonalAnimeCarousel,
  SeasonalAnimeCarouselLoader,
} from "@/components/anime/carousel";
import { ContinueWatching } from "@/components/anime/continue-watching";
import { GenreMenu } from "@/components/anime/genre-menu";
import { PlanToWatch } from "@/components/anime/plan-to-watch";
import { TopAnime as TopAnimeClient } from "@/components/anime/top-anime";
import { TrendingAnime as TrendingAnimeClient } from "@/components/anime/trending-anime";
import Authenticated from "@/components/auth";
import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense, type ReactNode } from "react";

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  void api.mal.getContinueWatching.prefetch({ page: 1 });
  void api.mal.getPlanToWatch.prefetch({ page: 1 });

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
        <Authenticated authenticatedElement={UserLibrarySections} />
      </Suspense>
      <div className="w-full md:grid md:grid-cols-4">
        <section className="col-span-3">{children}</section>
        <section className="flex flex-col justify-start gap-6 pl-2 md:flex-col-reverse md:justify-end">
          <Suspense
            fallback={<Skeleton className="h-[1000px] w-full rounded-md" />}
          >
            <TopAnime />
          </Suspense>
          <GenreMenu />
        </section>
      </div>
    </>
  );
};

const UserLibrarySections = () => {
  void api.mal.getContinueWatching.prefetch({ page: 1 });
  void api.mal.getPlanToWatch.prefetch({ page: 1 });

  return (
    <HydrateClient>
      <ContinueWatching />
      <PlanToWatch />
    </HydrateClient>
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

const TopAnime = async () => {
  const topAnime = await api.hiAnime.getTopAnime();

  return <TopAnimeClient topAnime={topAnime} />;
};

export default HomeLayout;
