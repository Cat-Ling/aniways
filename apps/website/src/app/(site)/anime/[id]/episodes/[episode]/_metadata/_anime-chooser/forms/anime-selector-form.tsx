import { useState } from "react";
import { useParams } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import { DialogClose, DialogFooter } from "@aniways/ui/dialog";
import { Skeleton } from "@aniways/ui/skeleton";
import { toast } from "@aniways/ui/sonner";

import { api } from "~/trpc/react";

interface AnimeSelectorFormProps {
  query: string;
  onChangeMode: () => void;
}

export const AnimeSelectorForm = ({
  query,
  onChangeMode,
}: AnimeSelectorFormProps) => {
  const params = useParams();
  const [page, setPage] = useState(1);
  const utils = api.useUtils();

  const searchQuery = api.myAnimeList.search.useQuery(
    {
      query,
      page,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  const updateMalAnimeId = api.anime.updateMalAnimeId.useMutation({
    onSuccess: async () => {
      toast.success("Anime updated successfully", {
        description: "Thanks for updating the anime!",
      });
      await utils.anime.byId.invalidate();
      await utils.myAnimeList.getAnimeMetadata.invalidate();
    },
  });

  if (searchQuery.isError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  if (searchQuery.isLoading || !searchQuery.data) {
    return <Skeleton className="h-[480px] w-full" />;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {searchQuery.data.data.map(anime => (
        <DialogClose
          key={anime.mal_id}
          onClick={() => {
            const id = params.id;

            if (!id || typeof id !== "string") return;
            if (!anime.mal_id) return;

            updateMalAnimeId.mutate({
              id,
              malId: anime.mal_id,
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
          <Button onClick={() => onChangeMode()}>Can't find the anime?</Button>
          <div className="flex gap-2">
            {page > 1 ?
              <Button
                variant={"secondary"}
                onClick={() => setPage(page => page - 1)}
              >
                Previous
              </Button>
            : null}
            {searchQuery.data.pagination.has_next_page ?
              <Button
                variant={"secondary"}
                onClick={() => setPage(page => page + 1)}
                disabled={searchQuery.isPlaceholderData}
              >
                {searchQuery.isPlaceholderData ?
                  <Loader2 className="h-4 w-4 animate-spin" />
                : "Next"}
              </Button>
            : null}
          </div>
        </div>
      </DialogFooter>
    </div>
  );
};
