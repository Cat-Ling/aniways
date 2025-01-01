"use client";

import { Loader2 } from "lucide-react";

import type { RouterOutputs } from "@/trpc/react";
import { Button } from "@/components/ui/button";

import { LoginModal } from "@/components/navigation/login-modal";
import { api } from "@/trpc/react";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

interface AddToListButtonProps {
  metadata: Exclude<RouterOutputs["mal"]["getAnimeInfo"], undefined>;
}

export const AddToListButton = ({ metadata: { id } }: AddToListButtonProps) => {
  const { session } = useAuth();
  const utils = api.useUtils();
  const addToList = api.mal.addEntryToMal.useMutation({
    onSuccess: async () => {
      await utils.mal.getContinueWatching.invalidate();
      await utils.mal.getPlanToWatch.invalidate();
      await utils.mal.getAnimeInfo.invalidate();
      toast.success("Added to list", {
        description: "Anime has been added to your list",
      });
    },
    onError: (error) => {
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
      {addToList.isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        "Add to List"
      )}
    </Button>
  );
};
