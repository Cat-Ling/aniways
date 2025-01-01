import type { RouterOutputs } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

import { UpdateAnimeDialogForm } from "./update-anime-dialog-form";

interface UpdateAnimeButtonProps {
  metadata: Exclude<RouterOutputs["mal"]["getAnimeInfo"], undefined>;
}

export const UpdateAnimeButton = ({ metadata }: UpdateAnimeButtonProps) => {
  if (!metadata.id) return null;

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>Update Anime</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Update Anime - {metadata.title}</CredenzaTitle>
          <CredenzaDescription>
            Update the anime in your MyAnimeList Anime List
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <UpdateAnimeDialogForm
            malId={metadata.id}
            listStatus={metadata.listStatus}
          />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};
