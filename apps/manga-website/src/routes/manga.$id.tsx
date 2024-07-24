import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "../components/layout";
import { api } from "../trpc";

export const Route = createFileRoute("/manga/$id")({
  component: MangaInfoPage,
});

function MangaInfoPage() {
  const params = Route.useParams();

  const mangaInfo = api.manga.getMangaInfo.useQuery(params);

  return (
    <MainLayout>
      <pre>{JSON.stringify(mangaInfo.data, null, 2)}</pre>
    </MainLayout>
  );
}
