import { Skeleton } from "@/components/ui/skeleton";

const AnimeStreamingPageLoadingPage = () => {
  return (
    <>
      <div className="mb-2 flex-1">
        <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
      </div>
    </>
  );
};

export default AnimeStreamingPageLoadingPage;
