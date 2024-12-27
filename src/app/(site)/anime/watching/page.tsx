import { ContinueWatching } from "@/components/anime/continue-watching";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

const CurrentlyWatchingPage = async () => {
  const initalData = await api.mal
    .getContinueWatching({ page: 1 })
    .catch(() => null);

  console.log(initalData);

  if (!initalData) return notFound();

  return <ContinueWatching initialData={initalData} />;
};

export default CurrentlyWatchingPage;
