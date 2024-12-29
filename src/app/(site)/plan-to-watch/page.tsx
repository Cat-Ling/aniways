import { PlanToWatch } from "@/components/anime/plan-to-watch";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

const PlanToWatchPage = async () => {
  const initalData = await api.mal
    .getPlanToWatch({ page: 1 })
    .catch(() => null);

  if (!initalData) return notFound();

  return <PlanToWatch initialData={initalData} />;
};

export default PlanToWatchPage;
