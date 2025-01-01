import { AnimeGrid } from "@/components/layouts/anime-grid";
import { Pagination } from "@/components/pagination";
import { api } from "@/trpc/server";

type GenrePageProps = {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
};

const GenrePage = async ({ params, searchParams }: GenrePageProps) => {
  const [{ genre }, { page = "1" }] = await Promise.all([params, searchParams]);

  const { animes, hasNextPage, genreName } = await api.hiAnime.getGenreAnime({
    genre,
    page: Number.isNaN(parseInt(page)) ? 1 : parseInt(page),
  });

  return (
    <>
      <div className="mb-2 flex w-full items-center justify-between md:mb-5">
        <h1 className="text-lg font-bold md:text-2xl">{genreName}</h1>
        <Pagination hasNext={hasNextPage} />
      </div>
      <div className="mb-6">
        <div className="mb-3">
          <AnimeGrid animes={animes.slice(0, 4)} type="featured" />
        </div>
        <AnimeGrid animes={animes.slice(4)} />
      </div>
      <Pagination hasNext={hasNextPage} />
    </>
  );
};

export default GenrePage;
