import type { MyAnimeListServiceTypes } from "@aniways/data";

import { AddToListButton } from "./add-to-list-button";
import { UpdateAnimeButton } from "./update-anime-button";

interface MyAnimeListButtonProps {
  details: MyAnimeListServiceTypes.AnimeMetadata;
}

export const MyAnimeListButton = ({ details }: MyAnimeListButtonProps) => {
  if (details.listStatus) {
    return (
      <UpdateAnimeButton
        details={{
          ...details,
          listStatus: details.listStatus,
        }}
      />
    );
  }

  return <AddToListButton malId={details.mal_id} />;
};
