"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { RouterOutputs } from "@aniways/trpc";
import { Button } from "@aniways/ui/button";
import {
  CredenzaClose,
  CredenzaFooter,
  useCredenzaContext,
} from "@aniways/ui/credenza";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@aniways/ui/form";
import { Input } from "@aniways/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@aniways/ui/select";
import { toast } from "@aniways/ui/sonner";

import { env } from "~/env";
import { api } from "~/trpc/react";

const status = [
  "watching",
  "completed",
  "on_hold",
  "dropped",
  "plan_to_watch",
] as const;

const scores = [
  { value: 0 },
  { value: 1, label: "(1) Appalling" },
  { value: 2, label: "(2) Horrible" },
  { value: 3, label: "(3) Very Bad" },
  { value: 4, label: "(4) Bad" },
  { value: 5, label: "(5) Average" },
  { value: 6, label: "(6) Fine" },
  { value: 7, label: "(7) Good" },
  { value: 8, label: "(8) Very Good" },
  { value: 9, label: "(9) Great" },
  { value: 10, label: "(10) Masterpiece" },
];

const UpdateAnimeSchema = z.object({
  status: z.enum(
    ["watching", "completed", "on_hold", "dropped", "plan_to_watch"],
    {
      required_error: "Please select a status",
    }
  ),
  episodesWatched: z.coerce
    .number({
      required_error: "Please enter the number of episodes watched",
    })
    .min(0, {
      message: "Please enter a valid episode number",
    }),
  score: z.coerce.number().int().min(0).max(10).optional(),
});

interface UpdateAnimeDialogFormProps {
  malId: number;
  listStatus: Exclude<
    RouterOutputs["myAnimeList"]["getAnimeMetadata"],
    undefined
  >["listStatus"];
}

export const UpdateAnimeDialogForm = ({
  malId,
  listStatus,
}: UpdateAnimeDialogFormProps) => {
  const { close } = useCredenzaContext();

  const form = useForm<z.infer<typeof UpdateAnimeSchema>>({
    resolver: zodResolver(UpdateAnimeSchema),
    defaultValues: {
      status: listStatus?.status,
      episodesWatched: listStatus?.num_episodes_watched,
      score: listStatus?.score,
    },
  });

  const utils = api.useUtils();

  const updateAnimeInMyList = api.myAnimeList.updateAnimeInMyList.useMutation({
    onSuccess: async () => {
      await utils.anime.continueWatching.invalidate();
      await utils.myAnimeList.getAnimeMetadata.invalidate();
      toast.success("List updated", {
        description: "Your list has been updated",
      });
      close();
    },
    onError: error => {
      toast.error(
        env.NODE_ENV === "development" ?
          error.message
        : "Failed to update list",
        {
          description: "Please try again later",
        }
      );
    },
  });

  const deleteAnimeInMyList = api.myAnimeList.deleteFromMyList.useMutation({
    onSuccess: async () => {
      await utils.anime.continueWatching.invalidate();
      await utils.myAnimeList.getAnimeMetadata.invalidate();
      toast.success("Anime deleted", {
        description: "Anime has been removed from your list",
      });
      close();
    },
    onError: error => {
      toast.error(
        env.NODE_ENV === "development" ?
          error.message
        : "Failed to delete anime",
        {
          description: "Please try again later",
        }
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => {
          updateAnimeInMyList.mutate({
            malId,
            numWatchedEpisodes: data.episodesWatched,
            score: data.score ?? 0,
            status: data.status,
          });
        })}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="episodesWatched"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episodes Watched</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Episodes Watched"
                    type="number"
                  />
                </FormControl>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  type="button"
                  onClick={field.onChange.bind(null, field.value - 1)}
                >
                  <MinusIcon />
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  type="button"
                  onClick={field.onChange.bind(null, field.value + 1)}
                >
                  <PlusIcon />
                </Button>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={
                  field.value === 0 ? undefined : String(field.value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Score" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {scores
                    .filter(score => score.label)
                    .reverse()
                    .map(score => (
                      <SelectItem key={score.value} value={String(score.value)}>
                        {score.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <CredenzaFooter className="mt-6 w-full px-0 sm:justify-between">
          <CredenzaClose asChild>
            <Button
              variant={"secondary"}
              type="button"
              className="hidden md:block"
            >
              Cancel
            </Button>
          </CredenzaClose>
          <div className="flex flex-col-reverse gap-2 md:flex-row md:gap-2">
            <Button
              type="button"
              variant={"secondary"}
              disabled={deleteAnimeInMyList.isPending}
              onClick={() => {
                deleteAnimeInMyList.mutate({ malId });
              }}
            >
              {deleteAnimeInMyList.isPending ?
                <Loader2 className="animate-spin" />
              : "Delete Entry"}
            </Button>
            <div className="my-2 h-[1px] w-full bg-muted md:hidden" />
            <CredenzaClose asChild>
              <Button
                variant={"secondary"}
                type="button"
                className="block md:hidden"
              >
                Cancel
              </Button>
            </CredenzaClose>
            <Button type="submit" disabled={updateAnimeInMyList.isPending}>
              {updateAnimeInMyList.isPending ?
                <Loader2 className="animate-spin" />
              : "Update Anime"}
            </Button>
          </div>
        </CredenzaFooter>
      </form>
    </Form>
  );
};
