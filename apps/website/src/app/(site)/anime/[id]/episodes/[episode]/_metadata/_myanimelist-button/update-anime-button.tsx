import type { RouterOutputs } from "@aniways/api";
import { Button } from "@aniways/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@aniways/ui/dialog";

import { UpdateAnimeDialogForm } from "./update-anime-dialog-form";

interface UpdateAnimeButtonProps {
  metadata: Exclude<
    RouterOutputs["myAnimeList"]["getAnimeMetadata"],
    undefined
  >;
}

export const UpdateAnimeButton = ({ metadata }: UpdateAnimeButtonProps) => {
  if (!metadata.mal_id) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Update Anime</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Anime - {metadata.title}</DialogTitle>
        <DialogDescription>
          Update the anime in your MyAnimeList Anime List
        </DialogDescription>
        <UpdateAnimeDialogForm
          malId={metadata.mal_id}
          listStatus={metadata.listStatus}
        />
      </DialogContent>
    </Dialog>
  );
};
