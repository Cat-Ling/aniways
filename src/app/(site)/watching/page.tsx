import { ContinueWatching } from "@/components/anime/continue-watching";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

type CurrentlyWatchingPageProps = {
  searchParams: Promise<{ page: string | undefined }>;
};

const CurrentlyWatchingPage = async ({
  searchParams,
}: CurrentlyWatchingPageProps) => {
  const page = await searchParams.then(({ page }) => Number(page ?? 1));

  const initalData = await api.mal
    .getContinueWatching({ page })
    .catch(() => null);

  if (!initalData) return notFound();

  return <ContinueWatching initialData={initalData} />;
};

export default CurrentlyWatchingPage;
