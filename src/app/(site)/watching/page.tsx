import { ContinueWatching } from "@/components/anime/continue-watching";
import { api, HydrateClient } from "@/trpc/server";

type CurrentlyWatchingPageProps = {
  searchParams: Promise<{ page: string | undefined }>;
};

const CurrentlyWatchingPage = async ({
  searchParams,
}: CurrentlyWatchingPageProps) => {
  const page = await searchParams.then(({ page }) => Number(page ?? 1));

  void api.mal.getContinueWatching.prefetch({ page });

  return (
    <HydrateClient>
      <ContinueWatching />
    </HydrateClient>
  );
};

export default CurrentlyWatchingPage;
