import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { PaginationLoader } from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const GenreLoading = () => {
  return (
    <>
      <div className="mb-2 flex w-full items-center justify-between md:mb-5">
        <Skeleton className="h-7 w-1/6 text-lg font-bold md:h-8 md:text-2xl" />
        <PaginationLoader />
      </div>
      <AnimeGridLoader featured />
    </>
  );
};

export default GenreLoading;
