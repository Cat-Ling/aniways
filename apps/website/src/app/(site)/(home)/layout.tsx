import type { ReactNode } from "react";
import { Suspense } from "react";

import { Skeleton } from "@aniways/ui/skeleton";

import { api } from "~/trpc/server";
import { AnimeGrid, AnimeGridLoader } from "../anime-grid";
import { AnimeCarousel } from "./carousel";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Suspense fallback={<Skeleton className="mb-2 h-[430px] md:mb-5" />}>
        <SeasonalAnimeCarousel />
      </Suspense>
      <Suspense fallback={<CurrentlyWatchingAnimeLoader />}>
        <CurrentlyWatchingAnime />
      </Suspense>
      {children}
    </>
  );
}

const SeasonalAnimeCarousel = async () => {
  const seasonalAnime = await api.myAnimeList.getCurrentSeasonAnimes();

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
  const newReleases = await api.anime.continueWatching().catch(() => []);

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
