import { ContinueWatching as ContinueWatchingClient } from "@/components/anime/continue-watching";
import { AnimeCarousel as AnimeCarouselClient } from "@/components/anime/seasonal-anime-carousel";
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
      <Suspense fallback={<Skeleton className="mb-6 h-[450px] w-full" />}>
        <AnimeCarousel />
      </Suspense>
      <Suspense fallback={<AnimeGridLoader />}>
        <ContinueWatching />
      </Suspense>
      {children}
    </>
  );
};

const AnimeCarousel = async () => {
  const seasonalAnime = await api.mal.getCurrentSeasonalAnime();

  return <AnimeCarouselClient seasonalAnime={seasonalAnime.slice(0, 10)} />;
};

const ContinueWatching = async () => {
  const initalData = await api.mal.getContinueWatching();

  return <ContinueWatchingClient initialData={initalData} />;
};

export default HomeLayout;
