import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { cn } from "@aniways/ui";

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
        <MangaImage key={image.url} src={image.url} alt={image.alt} />
      ))}
      <pre>{JSON.stringify(chapter.data, null, 2)}</pre>
    </MainLayout>
  );
}

function MangaImage(props: { src?: string; alt?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <img
      src={`/images/${props.src}`}
      alt={props.alt}
      className={cn(
        "w-full object-contain object-center",
        isLoading &&
          "h-[calc((100vw-64px)*1.5)] bg-muted 2xl:h-[calc((1400px-64px)*1.5)]"
      )}
      loading="lazy"
      onLoad={() => setIsLoading(false)}
    />
  );
}
