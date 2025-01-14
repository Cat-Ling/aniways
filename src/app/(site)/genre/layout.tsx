import { GenreMenu } from "@/components/anime/genre-menu";
import { TopAnime as TopAnimeClient } from "@/components/anime/top-anime";
import { Skeleton } from "@/components/ui/skeleton";
import { type RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/server";
import { Suspense, type ReactNode } from "react";

type GenreLayoutProps = {
  children: ReactNode;
};

const GenreLayout = async ({ children }: GenreLayoutProps) => {
  const topAnime = api.hiAnime.getTopAnime();

  return (
    <div className="w-full md:grid md:grid-cols-4">
      <section className="col-span-3">{children}</section>
      <section className="flex flex-col justify-start gap-6 pl-2 md:flex-col-reverse md:justify-end">
        <Suspense
          fallback={<Skeleton className="h-[1000px] w-full rounded-md" />}
        >
          <TopAnime topAnime={topAnime} />
        </Suspense>
        <GenreMenu />
      </section>
    </div>
  );
};

const TopAnime = async ({
  topAnime,
}: {
  topAnime: Promise<RouterOutputs["hiAnime"]["getTopAnime"]>;
}) => {
  return <TopAnimeClient topAnime={await topAnime} />;
};

export default GenreLayout;
