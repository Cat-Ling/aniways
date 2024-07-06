"use client";

import { Loader2 } from "lucide-react";

import type { RouterOutputs } from "@aniways/api";
import { useAuth } from "@aniways/auth/react";
import { Button } from "@aniways/ui/button";
import { toast } from "@aniways/ui/sonner";

import { LoginModal } from "~/components/auth/login-modal";
import { api } from "~/trpc/react";

interface AddToListButtonProps {
  metadata: Exclude<
    RouterOutputs["myAnimeList"]["getAnimeMetadata"],
    undefined
  >;
}

export const AddToListButton = ({ metadata: { id } }: AddToListButtonProps) => {
  const session = useAuth();
  const utils = api.useUtils();
  const addToList = api.myAnimeList.addToMyList.useMutation({
    onSuccess: async () => {
      await utils.anime.continueWatching.invalidate();
      await utils.myAnimeList.getAnimeMetadata.invalidate();
      toast.success("Added to list", {
        description: "Anime has been added to your list",
      });
    },
    onError: error => {
      toast.error("Failed to add to list", {
        description: error.message,
      });
    },
  });

  if (!session.user) {
    return <LoginModal>Add To List</LoginModal>;
  }

  if (!id) return null;

  return (
    <Button
      onClick={() => addToList.mutate({ malId: id })}
      disabled={addToList.isPending}
    >
      {addToList.isPending ?
        <Loader2 className="animate-spin" />
      : "Add to List"}
    </Button>
  );
};
