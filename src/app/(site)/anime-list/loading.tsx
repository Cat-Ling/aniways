import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { Skeleton } from "@/components/ui/skeleton";

const AnimeListLoadingPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-col gap-6 md:mb-3">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-20 w-full md:h-10 md:w-[516px]" />
      </div>
      <AnimeGridLoader />
    </div>
  );
};

export default AnimeListLoadingPage;
