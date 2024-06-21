"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@aniways/auth";
import { Button } from "@aniways/ui/button";
import { toast } from "@aniways/ui/sonner";

import { LoginModal } from "~/app/login-modal";
import { useMetadata } from "../metadata-provider";
import { addToListAction } from "./myanimelist-actions";

interface AddToListButtonProps {
  malId: number | undefined;
}

export const AddToListButton = ({ malId }: AddToListButtonProps) => {
  const [, setMetadata] = useMetadata();
  const session = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  if (!session.user) {
    return <LoginModal>Add To List</LoginModal>;
  }

  if (!malId) return null;

  return (
    <Button
      onClick={async () => {
        setLoading(true);

        try {
          const { error, details } = await addToListAction(
            malId,
            `/anime/${typeof id === "string" ? id : id?.[0]}`,
          );

          if (error || !details) {
            throw new Error("Failed to add to list");
          }

          setMetadata(details);

          toast.success("Added to list", {
            description: "Anime has been added to your list",
          });
        } catch (e) {
          const error =
            e instanceof Error ? e : new Error("Failed to add to list");

          toast.error("Failed to add to list", {
            description: error.message,
          });
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "Add to List"}
    </Button>
  );
};
