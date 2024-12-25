import { type RouterOutputs } from "@/trpc/react";
import { UpdateAnimeButton } from "./update-anime-btn";
import { AddToListButton } from "./add-to-list-btn";

interface MyAnimeListButtonProps {
  metadata: Exclude<RouterOutputs["mal"]["getAnimeInfo"], undefined>;
}

export const MalButton = ({ metadata }: MyAnimeListButtonProps) => {
  if (metadata.listStatus) {
    return <UpdateAnimeButton metadata={metadata} />;
  }

  return <AddToListButton metadata={metadata} />;
};
