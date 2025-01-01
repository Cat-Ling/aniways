import { type RouterInputs } from "@/trpc/react";
import { api } from "@/trpc/server";
import { MalClient } from "./mal-client";

interface MalProps {
  status: RouterInputs["mal"]["getAnimeListOfUser"]["status"];
}

export const Mal = async ({ status }: MalProps) => {
  const animeList = await api.mal.getAnimeListOfUser({
    status,
    cursor: 1,
  });

  return <MalClient initialData={animeList} status={status} />;
};
