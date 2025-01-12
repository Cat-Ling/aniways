import { PlanToWatch } from "@/components/anime/plan-to-watch";
import { api, HydrateClient } from "@/trpc/server";

type PlanToWatchPageProps = {
  searchParams: Promise<{ page: string | undefined }>;
};

const PlanToWatchPage = async ({ searchParams }: PlanToWatchPageProps) => {
  const page = await searchParams.then(({ page }) => Number(page ?? 1));

  void api.mal.getPlanToWatch.prefetch({ page });

  return (
    <HydrateClient>
      <PlanToWatch />
    </HydrateClient>
  );
};

export default PlanToWatchPage;
