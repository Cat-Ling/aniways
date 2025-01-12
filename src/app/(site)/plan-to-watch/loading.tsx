import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";

const PlanToWatchLoadingPage = () => (
  <>
    <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
      Your Plan to Watch
    </h1>
    <AnimeGridLoader />
  </>
);

export default PlanToWatchLoadingPage;
