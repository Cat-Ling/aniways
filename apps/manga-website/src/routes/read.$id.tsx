import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "../components/layout";
import { api } from "../trpc";

export const Route = createFileRoute("/read/$id")({
  component: ReadMangaPage,
});

function ReadMangaPage() {
  const params = Route.useParams();
  const chapter = api.manga.getChapterPages.useQuery({
    chapterId: params.id,
  });

  if (chapter.isLoading) {
    return (
      <MainLayout>
        <h1>Loading...</h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1>Read Manga Page</h1>
      <p>Reading manga with ID: {params.id}</p>
      {chapter.data?.images.map(image => (
        <img
          key={image.url}
          src={image.url}
          alt={image.alt}
          className="w-full"
        />
      ))}
      <pre>{JSON.stringify(chapter.data, null, 2)}</pre>
    </MainLayout>
  );
}
