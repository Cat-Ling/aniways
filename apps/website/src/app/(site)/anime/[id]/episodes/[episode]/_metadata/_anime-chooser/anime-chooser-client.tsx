"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import {
  DialogClose,
  DialogFooter,
  useDialogContext,
} from "@aniways/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  reactHookForm,
  zod,
  zodResolver,
} from "@aniways/ui/form";
import { Input } from "@aniways/ui/input";
import { Skeleton } from "@aniways/ui/skeleton";
import { toast } from "@aniways/ui/sonner";

import { useMetadata } from "../metadata-provider";
import { searchAnimeAction } from "./search-anime-action";
import { updateMalAnimeAction } from "./update-mal-anime-action";

const { z } = zod;
const { useForm } = reactHookForm;

interface AnimeChooserClientProps {
  query: string;
}

const UpdateAnimeSchema = z.object({
  malLink: z
    .string({
      required_error: "Please enter a valid MAL link",
    })
    .min(1, "Please enter a valid MAL link")
    .url({
      message: "Please enter a valid MAL link",
    })
    .refine(
      (value) => {
        const { success } = z.string().url().safeParse(value);
        if (!success) return false;
        const url = new URL(value);
        return (
          url.hostname === "myanimelist.net" &&
          url.pathname.includes("/anime/") &&
          url.pathname.split("/").length === 4
        );
      },
      {
        message: "Please enter a valid MAL link",
      },
    )
    .transform((value) => {
      const { success } = z.string().url().safeParse(value);
      if (!success) return false;
      const url = new URL(value);
      return url.pathname.split("/")[2];
    })
    .refine(
      (value) => {
        return !isNaN(Number(value));
      },
      {
        message: "Please enter a valid MAL link",
      },
    )
    .transform((value) => Number(value)),
});

type Mode = "search" | "url";

export const AnimeChooserClient = ({ query }: AnimeChooserClientProps) => {
  const [mode, setMode] = useState<Mode>("search");

  return mode === "search" ? (
    <AnimeChooserClientSelect query={query} setMode={setMode} />
  ) : (
    <AnimeChooserClientUrlForm setMode={setMode} />
  );
};

interface AnimeChooserClientSelectProps {
  query: string;

  setMode: (mode: Mode) => void;
}

const AnimeChooserClientSelect = ({
  query,
  setMode,
}: AnimeChooserClientSelectProps) => {
  const [, setMetadata] = useMetadata();
  const params = useParams();
  const [page, setPage] = useState(1);
  const { isLoading, data, isError } = useQuery({
    queryKey: ["searchAnime", query, page],
    queryFn: () => searchAnimeAction(query, page),
  });

  if (isError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  if (isLoading) {
    return <Skeleton className="h-[480px] w-full" />;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {data?.data.map((anime) => (
        <DialogClose
          key={anime.mal_id}
          onClick={async () => {
            const id = params.id;
            if (!id || typeof id !== "string") return;
            if (!anime.mal_id) return;

            const metadata = await updateMalAnimeAction(id, anime.mal_id);
            if (metadata) setMetadata(metadata);

            toast.success("Anime updated successfully", {
              description: "Thanks for updating the anime!",
            });
          }}
          asChild
        >
          <Button
            className="flex h-fit w-full items-start justify-start gap-4 whitespace-normal text-wrap break-words text-left"
            variant={"ghost"}
          >
            <Image
              src={anime.images.jpg.image_url ?? ""}
              alt={anime.title ?? ""}
              width={100}
              height={100 * (650 / 450)}
              className="hidden aspect-[450/650] h-auto w-[100px] rounded-md border border-border bg-muted object-contain md:block"
            />
            <div className="flex h-full flex-col justify-center gap-2">
              <h2 className="text-sm font-bold md:text-base">{anime.title}</h2>
              <p className="text-xs text-muted-foreground md:text-sm">
                {anime.title_english}
              </p>
              <div className="flex items-center gap-2">
                <p className="w-fit rounded-md bg-muted p-2 text-xs text-primary md:text-sm">
                  {anime.type}
                </p>
                <p className="w-fit rounded-md bg-muted p-2 text-xs text-primary md:text-sm">
                  {anime.status}
                </p>
                <p className="w-fit rounded-md bg-muted p-2 text-xs text-primary md:text-sm">
                  {anime.episodes ?? "?"}{" "}
                </p>
              </div>
            </div>
          </Button>
        </DialogClose>
      ))}

      <DialogFooter className="px-4">
        <div className="flex w-full justify-between">
          <Button onClick={() => setMode("url")}>Can't find the anime?</Button>
          <div className="flex gap-2">
            {page > 1 ? (
              <Button
                variant={"secondary"}
                onClick={() => setPage((page) => page - 1)}
              >
                Previous
              </Button>
            ) : null}
            {data?.pagination.has_next_page ? (
              <Button
                variant={"secondary"}
                onClick={() => setPage((page) => page + 1)}
              >
                Next
              </Button>
            ) : null}
          </div>
        </div>
      </DialogFooter>
    </div>
  );
};

interface AnimeChooserClientUrlFormProps {
  setMode: (mode: Mode) => void;
}

const AnimeChooserClientUrlForm = ({
  setMode,
}: AnimeChooserClientUrlFormProps) => {
  const [, setMetadata] = useMetadata();
  const params = useParams();
  const { close } = useDialogContext();
  const form = useForm<zod.infer<typeof UpdateAnimeSchema>>({
    resolver: zodResolver(UpdateAnimeSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const id = params.id;
    if (!id || typeof id !== "string") return;

    const metadata = await updateMalAnimeAction(id, data.malLink);
    if (metadata) setMetadata(metadata);

    close();

    toast.success("Anime updated successfully", {
      description: "Thanks for updating the anime!",
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
        <DialogFooter className="mt-6 flex w-full !justify-between gap-2">
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => setMode("search")}
          >
            Return to search
          </Button>
          <Button>Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
