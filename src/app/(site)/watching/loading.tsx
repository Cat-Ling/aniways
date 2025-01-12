import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";

const CurrentlyWatchingLoadingPage = () => (
  <>
    <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
      Continue Watching
    </h1>
    <AnimeGridLoader />
  </>
);

export default CurrentlyWatchingLoadingPage;
