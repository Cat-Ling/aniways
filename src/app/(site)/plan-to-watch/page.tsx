import { PlanToWatch } from "@/components/anime/plan-to-watch";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

type PlanToWatchPageProps = {
  searchParams: Promise<{ page: string | undefined }>;
};

const PlanToWatchPage = async ({ searchParams }: PlanToWatchPageProps) => {
  const page = await searchParams.then(({ page }) => Number(page ?? 1));

  const initalData = await api.mal.getPlanToWatch({ page }).catch(() => null);

  if (!initalData) return notFound();

  return <PlanToWatch initialData={initalData} />;
};

export default PlanToWatchPage;
