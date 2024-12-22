import { Skeleton } from "@/components/ui/skeleton";

const AnimeStreamingPageLoadingPage = () => {
  return (
    <>
      <div className="mb-3">
        <Skeleton className="mb-2 h-7 w-96" />
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="mb-2 flex-1">
        <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
      </div>
    </>
  );
};

export default AnimeStreamingPageLoadingPage;
