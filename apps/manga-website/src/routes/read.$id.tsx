import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import type { RouterOutputs } from "@aniways/trpc";
import { cn } from "@aniways/ui";
import { Button } from "@aniways/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@aniways/ui/select";

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
      <MainLayout className="max-w-3xl md:max-w-3xl">
        <h1>Loading...</h1>
      </MainLayout>
    );
  }

  if (!chapter.data) {
    return (
      <MainLayout className="max-w-3xl md:max-w-3xl">
        <h1>Chapter not found</h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout className="max-w-3xl md:max-w-3xl">
      <h1 className="text-xl font-bold md:text-3xl">{chapter.data.title}</h1>

      <Navigation chapter={chapter.data} />

      {chapter.data.images.map(image => (
        <MangaImage key={image.url} src={image.url} alt={image.alt} />
      ))}

      <Navigation chapter={chapter.data} />
    </MainLayout>
  );
}

function MangaImage(props: { src?: string; alt?: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [showImage, setShowImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const src = useMemo(() => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (import.meta.env.DEV) {
      return `http://localhost:3000/api/images/${props.src}`;
    }

    return `/images/${props.src}`;
  }, [props.src]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShowImage(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [props]);

  return (
    <img
      ref={imageRef}
      src={showImage ? src : ""}
      alt={props.alt}
      className={cn(
        "w-full object-contain object-center",
        isLoading &&
          "h-[calc((100vw-64px)*1.5)] bg-muted md:h-[calc((768px-64px)*1.5)]"
      )}
      loading="lazy"
      onLoad={() => setIsLoading(false)}
      onError={() => {
        if (!showImage) {
          // If the image is not visible, we don't try to reload it
          return setIsLoading(true);
        }
        // Usually this is caused by 429 so we wait for a while and try again
        setTimeout(() => {
          if (!imageRef.current) return;
          imageRef.current.src = src;
        }, 1000);
      }}
    />
  );
}

function Navigation(props: {
  chapter: RouterOutputs["manga"]["getChapterPages"];
}) {
  const { chapter } = props;
  const navigate = useNavigate();

  return (
    <>
      <Button asChild variant={"link"} className="my-3 h-fit px-0">
        <Link to={`/manga/$id`} params={{ id: chapter.mangaId }} resetScroll>
          {"<<< Back to Manga"}
        </Link>
      </Button>

      <div>
        <h2 className="mb-2 text-lg font-bold md:text-xl">Chapters</h2>
        <Select
          value={chapter.id}
          onValueChange={value => {
            void navigate({
              to: "/read/$id",
              params: {
                id: value,
              },
              resetScroll: true,
            });
          }}
        >
          <SelectTrigger className="mb-6">
            <SelectValue placeholder="Select Chapter" className="w-full" />
          </SelectTrigger>
          <SelectContent>
            {chapter.chapterList.map(chapter => (
              <SelectItem key={chapter.id} value={chapter.id}>
                {chapter.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 flex w-full justify-between">
        {
          chapter.prevId ?
            <Button asChild>
              <Link
                to={`/read/$id`}
                params={{ id: chapter.prevId }}
                resetScroll
              >
                {"< Previous Chapter"}
              </Link>
            </Button>
          : <div /> // To keep the layout consistent
        }
        {chapter.nextId && (
          <Button asChild>
            <Link to={`/read/$id`} params={{ id: chapter.nextId }} resetScroll>
              {"Next Chapter >"}
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}
