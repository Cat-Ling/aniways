import type { ReactNode } from "react";

import type { RouterOutputs } from "@aniways/api";

import { CurrentlyWatchingAnime } from "~/components/anime/current-watching-anime";
import { AnimeCarousel } from "~/components/anime/seasonal-anime-carousel";
import { env } from "~/env";
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
  const baseUrl =
    env.NODE_ENV === "development" ?
      "http://localhost:3000"
    : "https://aniways.xyz";

  // use fetch to get data as it is cached on the server using isr instead of trpc
  const initialData = (await fetch(`${baseUrl}/api/seasonal`, {
    cache: "no-store",
  }).then(res => {
    return res.json();
  })) as RouterOutputs["myAnimeList"]["getCurrentSeasonAnimes"];

  return <AnimeCarousel initialData={initialData} />;
};

const CurrentlyWatchingAnimeWrapper = async () => {
  const newReleases = await api.anime.continueWatching().catch(() => []); // Catch error if the user is not logged in

  return <CurrentlyWatchingAnime newReleases={newReleases} />;
};
