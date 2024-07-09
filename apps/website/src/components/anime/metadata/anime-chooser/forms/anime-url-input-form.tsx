import type { z } from "zod";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@aniways/ui/button";
import { CredenzaFooter, useCredenzaContext } from "@aniways/ui/credenza";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@aniways/ui/form";
import { Input } from "@aniways/ui/input";
import { toast } from "@aniways/ui/sonner";

import { api } from "~/trpc/react";
import { UpdateAnimeSchema } from "./schema";

interface AnimeUrlInputFormProps {
  onChangeMode: () => void;
}

export const AnimeUrlInputForm = ({ onChangeMode }: AnimeUrlInputFormProps) => {
  const params = useParams();
  const { close } = useCredenzaContext();
  const form = useForm<z.infer<typeof UpdateAnimeSchema>>({
    resolver: zodResolver(UpdateAnimeSchema),
  });

  const utils = api.useUtils();

  const updateMalAnimeId = api.anime.updateMalAnimeId.useMutation({
    onSuccess: async () => {
      await utils.anime.continueWatching.invalidate();
      await utils.myAnimeList.getAnimeMetadata.invalidate();
      close();
      toast.success("Anime updated successfully", {
        description: "Thanks for updating the anime!",
      });
    },
  });

  const onSubmit = form.handleSubmit(data => {
    const id = params.id;
    if (!id || typeof id !== "string") return;

    updateMalAnimeId.mutate({
      id,
      malId: data.malLink,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="malLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MAL Url</FormLabel>
              <FormDescription>
                If you are unable to find the anime, you can input the MAL link
                here
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://myanimelist.net/anime/1/Cowboy_Bebop"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CredenzaFooter className="flex w-full flex-col-reverse !justify-between gap-2 px-0 md:mt-6 md:flex-row">
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => onChangeMode()}
          >
            Return to search
          </Button>
          <Button>Submit</Button>
        </CredenzaFooter>
      </form>
    </Form>
  );
};
