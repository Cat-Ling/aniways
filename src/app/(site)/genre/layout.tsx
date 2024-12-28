import { GenreMenu as GenreMenuClient } from "@/components/anime/genre-menu";
import { TopAnime as TopAnimeClient } from "@/components/anime/top-anime";
import { Skeleton } from "@/components/ui/skeleton";
import { type RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/server";
import { Suspense, type ReactNode } from "react";

type GenreLayoutProps = {
  children: ReactNode;
};

const GenreLayout = async ({ children }: GenreLayoutProps) => {
  const allGenres = api.hiAnime.getGenres();
  const topAnime = api.hiAnime.getTopAnime();

  return (
    <div className="w-full md:grid md:grid-cols-4">
      <section className="col-span-3">{children}</section>
      <section className="flex flex-col justify-start gap-6 pl-2 md:flex-col-reverse md:justify-end">
        <Suspense
          fallback={
            <>
              <Skeleton className="h-[1000px] w-full rounded-md" />
              <Skeleton className="h-[500px] w-full rounded-md" />
            </>
          }
        >
          <TopAnime topAnime={topAnime} />
          <GenreMenu genres={allGenres} />
        </Suspense>
      </section>
    </div>
  );
};

const GenreMenu = async ({
  genres,
}: {
  genres: Promise<RouterOutputs["hiAnime"]["getGenres"]>;
}) => {
  return <GenreMenuClient genres={await genres} />;
};

const TopAnime = async ({
  topAnime,
}: {
  topAnime: Promise<RouterOutputs["hiAnime"]["getTopAnime"]>;
}) => {
  return <TopAnimeClient topAnime={await topAnime} />;
};

export default GenreLayout;
