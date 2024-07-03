import type { RouterInputs } from "@aniways/api";

import { api } from "~/trpc/server";
import { AnimeListClient } from "./anime-list-client";

interface AnimeListProps {
  status: RouterInputs["myAnimeList"]["getAnimeListOfUser"]["status"];
}

export const AnimeList = async ({ status }: AnimeListProps) => {
  const animeList = await api.myAnimeList.getAnimeListOfUser({
    status,
    cursor: 1,
  });

  return <AnimeListClient initialData={animeList} status={status} />;
};
