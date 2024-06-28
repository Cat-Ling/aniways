import type { ReactNode } from "react";

import { api } from "~/trpc/server";
import { AnimeCarousel } from "./carousel";
import { CurrentlyWatchingAnimeClient } from "./currently-watching-anime-client";

interface HomeLayoutProps {
  children: ReactNode;
}

export const dynamic = "force-static";

export const revalidate = 3600; // 1 hour

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <AnimeCarousel />
      <CurrentlyWatchingAnime />
      {children}
    </>
  );
}

const CurrentlyWatchingAnime = async () => {
  const newReleases = await api.anime.continueWatching().catch(() => []);

  if (!newReleases.length) return undefined;

  return (
    <>
      <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
        Continue Watching
      </h1>
      <div className="mb-6">
        <CurrentlyWatchingAnimeClient newReleases={newReleases} />
      </div>
    </>
  );
};
