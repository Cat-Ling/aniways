import type { ReactNode } from "react";

import { CurrentlyWatchingAnime } from "~/components/anime/current-watching-anime";
import { AnimeCarousel } from "~/components/anime/seasonal-anime-carousel";
import { api } from "~/trpc/server";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <AnimeCarouselWrapper />
      <CurrentlyWatchingAnimeWrapper />
      {children}
    </>
  );
}

const AnimeCarouselWrapper = async () => {
  const seasonalAnime = await api.seasonalAnime.getCachedSeasonalAnimes();

  return <AnimeCarousel seasonalAnime={seasonalAnime} />;
};

const CurrentlyWatchingAnimeWrapper = async () => {
  const newReleases = await api.anime.continueWatching().catch(() => []); // Catch error if the user is not logged in

  return <CurrentlyWatchingAnime newReleases={newReleases} />;
};
