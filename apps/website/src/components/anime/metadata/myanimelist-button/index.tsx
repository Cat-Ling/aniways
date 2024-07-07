import type { RouterOutputs } from "@aniways/trpc";

import { AddToListButton } from "./add-to-list-button";
import { UpdateAnimeButton } from "./update-anime-button";

interface MyAnimeListButtonProps {
  metadata: Exclude<
    RouterOutputs["myAnimeList"]["getAnimeMetadata"],
    undefined
  >;
}

export const MyAnimeListButton = ({ metadata }: MyAnimeListButtonProps) => {
  if (metadata.listStatus) {
    return <UpdateAnimeButton metadata={metadata} />;
  }

  return <AddToListButton metadata={metadata} />;
};
