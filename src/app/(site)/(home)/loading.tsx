import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { Skeleton } from "@/components/ui/skeleton";

const HomePageLoading = () => {
  return (
    <>
      <Skeleton className="mb-2 h-7 w-60 font-bold md:mb-5 md:h-8" />
      <div className="mb-6">
        <AnimeGridLoader featured />
      </div>
    </>
  );
};

export default HomePageLoading;
