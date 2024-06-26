import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon, Loader2 } from "lucide-react";

import type { RouterOutputs } from "@aniways/api";
import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import { CredenzaClose, CredenzaFooter } from "@aniways/ui/credenza";
import { Skeleton } from "@aniways/ui/skeleton";
import { toast } from "@aniways/ui/sonner";

import { api } from "~/trpc/react";

interface AnimeSelectorFormProps {
  query: string;
  onChangeMode: () => void;
}

type SearchAnime = RouterOutputs["myAnimeList"]["search"]["data"][number];

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

  const onClick = useCallback(
    (anime: SearchAnime) => {
      const id = params.id;

      if (!id || typeof id !== "string") return;
      if (!anime.mal_id) return;

      updateMalAnimeId.mutate({
        id,
        malId: anime.mal_id,
      });
    },
    [params, updateMalAnimeId]
  );

  if (searchQuery.isError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  if (searchQuery.isLoading || !searchQuery.data) {
    return <Skeleton className="h-[480px] w-full" />;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-full max-h-[40svh] flex-col gap-2 overflow-y-auto md:max-h-full">
        {searchQuery.data.data.map(anime => (
          <CredenzaClose key={anime.mal_id} asChild>
            <Button
              className="group relative flex h-fit w-full scale-95 flex-col items-start justify-center gap-4 whitespace-normal text-wrap break-words p-0 text-left transition hover:scale-100 md:scale-100 md:flex-row md:justify-start md:px-4 md:py-2"
              variant={"ghost"}
              onClick={onClick.bind(null, anime)}
            >
              <Image
                src={anime.images.jpg.image_url ?? ""}
                alt={anime.title ?? ""}
                width={100}
                height={100 * (650 / 450)}
                className="h-[200px] w-full rounded-md border border-border object-cover object-center md:h-[144px] md:w-[100px]"
              />
              <div className="absolute bottom-0 flex w-full flex-col items-center justify-center rounded-md bg-muted/80 py-2 md:static md:h-full md:w-auto md:items-start md:bg-transparent md:py-0">
                <h2 className="line-clamp-2 text-sm font-bold md:text-base">
                  {anime.title}
                </h2>
                <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">
                  {anime.title_english}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {[
                    anime.type,
                    anime.status,
                    `${anime.episodes ?? "?"} Episodes`,
                  ].map((text, index) => (
                    <p
                      key={index}
                      className="w-fit rounded-md bg-primary p-2 text-xs text-primary-foreground transition"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </Button>
          </CredenzaClose>
        ))}
      </div>
      <CredenzaFooter className="px-0 md:px-4">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 md:flex-row">
          <Button
            onClick={() => onChangeMode()}
            className="w-full md:w-auto"
            variant={"secondary"}
          >
            Can't find the anime?
          </Button>
          <div className="flex w-full items-center justify-between gap-2 md:w-auto">
            <Button
              variant={"ghost"}
              onClick={() => setPage(page => page - 1)}
              size="icon"
              disabled={searchQuery.isPlaceholderData || page <= 1}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <p className="w-8 text-center text-sm text-muted-foreground">
              {searchQuery.isPlaceholderData ? page - 1 : page}
            </p>
            <Button
              variant={"ghost"}
              onClick={() => setPage(page => page + 1)}
              disabled={
                searchQuery.isPlaceholderData ||
                !searchQuery.data.pagination.has_next_page
              }
              size="icon"
            >
              {searchQuery.isPlaceholderData ?
                <Loader2 className="h-4 w-4 animate-spin" />
              : <ArrowRightIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CredenzaFooter>
    </div>
  );
};
