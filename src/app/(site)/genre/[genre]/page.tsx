import { AnimeCard } from "@/components/layouts/anime-card";
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
        <AnimeGrid className="mb-3 md:grid-cols-4">
          {animes.slice(0, 4).map((anime) => (
            <AnimeCard
              key={anime.id}
              title={anime.jname ?? anime.name ?? "???"}
              subtitle={`${anime.episodes.sub ?? "???"} episodes`}
              poster={anime.poster ?? ""}
              url={`/anime/${anime.id}`}
            />
          ))}
        </AnimeGrid>
        <AnimeGrid>
          {animes.slice(4).map((anime) => (
            <AnimeCard
              key={anime.id}
              title={anime.jname ?? anime.name ?? "???"}
              subtitle={`${anime.episodes.sub ?? "???"} episodes`}
              poster={anime.poster ?? ""}
              url={`/anime/${anime.id}`}
            />
          ))}
        </AnimeGrid>
      </div>
      <Pagination hasNext={hasNextPage} />
    </>
  );
};

export default GenrePage;
