import { type RouterInputs } from "@/trpc/react";
import { api, HydrateClient } from "@/trpc/server";
import { MalClient } from "./mal-client";

interface MalProps {
  status: RouterInputs["mal"]["getAnimeListOfUser"]["status"];
}

export const Mal = ({ status }: MalProps) => {
  void api.mal.getAnimeListOfUser.prefetch({
    status,
    cursor: 1,
  });

  return (
    <HydrateClient>
      <MalClient status={status} />
    </HydrateClient>
  );
};
