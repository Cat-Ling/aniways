import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Book } from "lucide-react";

import { cn } from "@aniways/ui";
import { Button } from "@aniways/ui/button";

import { MainLayout } from "../components/layout";
import { api } from "../trpc";

export const Route = createFileRoute("/manga/$id")({
  component: MangaInfoPage,
});

function MangaInfoPage() {
  const params = Route.useParams();
  const mangaInfo = api.manga.getMangaInfo.useQuery(params);

  if (mangaInfo.isLoading) {
    return <MainLayout>Loading...</MainLayout>;
  }

  return (
    <MainLayout>
      <div className="mb-6 grid w-full grid-cols-1 gap-6 md:grid-cols-4">
        <div className="top-[6.5rem] h-fit w-full space-y-3 md:sticky">
          <img
            src={mangaInfo.data?.image}
            alt={mangaInfo.data?.title}
            className="w-full rounded-md border border-border object-cover"
          />
          <SidebarDescription
            title={mangaInfo.data?.title}
            description={mangaInfo.data?.description}
          />
        </div>
        <div className="relative flex flex-col gap-3 md:col-span-3">
          <h1 className="text-3xl font-bold">{mangaInfo.data?.title}</h1>
          <div className="flex flex-col gap-1 text-sm">
            <div>
              <span className="text-muted-foreground">
                Alternative Titles:{" "}
              </span>{" "}
              {mangaInfo.data?.altTitles.join(", ")}
            </div>
            <div>
              <span className="text-muted-foreground">Genres: </span>{" "}
              {mangaInfo.data?.genres.join(", ")}
            </div>
            <div>
              <span className="text-muted-foreground">Author: </span>{" "}
              {mangaInfo.data?.author}
            </div>
            <div>
              <span className="text-muted-foreground">Status: </span>{" "}
              {mangaInfo.data?.status}
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated: </span>{" "}
              {mangaInfo.data?.lastUpdated}
            </div>
          </div>
          <Description description={mangaInfo.data?.description} />
          <h2 className="text-xl font-bold">Chapters</h2>
          <div className="flex w-full gap-2 md:w-fit">
            <Button asChild variant={"default"} className="flex-1">
              <Link
                to="/read/$id"
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                params={mangaInfo.data!.chapters.at(-1)!}
                resetScroll
              >
                Read First Chapter
              </Link>
            </Button>
            <Button asChild variant={"secondary"} className="flex-1">
              <Link
                to="/read/$id"
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                params={mangaInfo.data!.chapters.at(0)!}
                resetScroll
              >
                Read Latest Chapter
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {mangaInfo.data?.chapters.map(chapter => (
              <Button
                key={chapter.id}
                variant="navlink"
                className="w-full justify-between rounded-none border-b border-border"
                asChild
              >
                <Link to="/read/$id" params={chapter} resetScroll>
                  <span className="w-full truncate">{chapter.title}</span>
                  <span className="text-muted-foreground">
                    {chapter.uploaded}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
          {mangaInfo.data?.chapters.at(-1) && (
            <Button className="sticky bottom-3 left-full mt-3 w-fit" asChild>
              <Link
                to="/read/$id"
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                params={mangaInfo.data.chapters.at(-1)!}
                resetScroll
              >
                <Book className="mr-2 size-4" />
                Read Now
              </Link>
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function Description(props: { description: string | undefined }) {
  const [showMore, setShowMore] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const listener = () => {
      if (!descriptionRef.current) return;
      if (
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight
      ) {
        setIsOverflow(true);
      }
    };

    listener();

    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return (
    <>
      <div className={cn("max-h-64 overflow-auto bg-background md:hidden")}>
        <p
          ref={descriptionRef}
          className={cn(
            "w-full whitespace-pre text-wrap text-muted-foreground",
            {
              "line-clamp-5": !showMore,
            }
          )}
        >
          {props.description?.split("\n").filter(Boolean).join("\n\n")}
        </p>
      </div>
      {isOverflow && (
        <Button
          variant="link"
          className={cn("h-fit w-fit bg-background p-0 md:hidden")}
          onClick={() => {
            setShowMore(prev => !prev);
          }}
        >
          {showMore ? "Show less" : "Show more"}
        </Button>
      )}
    </>
  );
}

function SidebarDescription(props: { description?: string; title?: string }) {
  const [isOverflow, setIsOverflow] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    if (!props.title) return;

    const scrollListener = () => {
      if (!props.title) return;
      if (window.scrollY > 100) {
        setShowTitle(true);
      } else {
        setShowTitle(false);
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [props.title]);

  return (
    <>
      {showTitle && (
        <motion.h1
          className="hidden text-3xl font-bold md:block"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {props.title}
        </motion.h1>
      )}
      <motion.p
        ref={ref => {
          if (!ref) return;
          if (isOverflow) return;
          setIsOverflow(ref.scrollHeight > ref.clientHeight);
        }}
        className={cn(
          "hidden max-h-56 w-full overflow-y-auto whitespace-pre text-wrap break-words bg-background text-muted-foreground md:block"
        )}
        layout="position"
      >
        {props.description
          ?.split("\n")
          .filter(Boolean)
          .join("\n\n")
          .split(" ")
          .map((word, index) => {
            // return anchor if word is a link
            if (word.startsWith("http")) {
              return (
                <a
                  key={index}
                  href={word}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-1 text-blue-500 underline"
                >
                  {word}
                </a>
              );
            }

            return `${word} `;
          })}
      </motion.p>
    </>
  );
}
