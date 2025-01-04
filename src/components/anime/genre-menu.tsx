"use client";

import { type RouterOutputs } from "@/trpc/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type GenreMenuProps = {
  genres: RouterOutputs["hiAnime"]["getGenres"];
};

export const GenreMenu = ({ genres }: GenreMenuProps) => {
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();

  const selectedIndex = useMemo(() => {
    return genres.findIndex((genre) =>
      pathname.split("/").includes(genre.toLowerCase().split(" ").join("-")),
    );
  }, [genres, pathname]);

  useEffect(() => {
    if (selectedIndex > 24) {
      setShowMore(true);
    }
  }, [selectedIndex]);

  return (
    <div className="flex w-full flex-col gap-3">
      <h1 className="text-lg font-bold md:text-2xl">Genres</h1>
      <div className="rounded-md bg-muted p-3">
        <div className="grid w-full grid-cols-3 gap-3">
          {genres
            .filter((_, index) => showMore || index < 24)
            .map((genre, i) => (
              <Button
                key={genre}
                variant="ghost"
                asChild
                className={cn(
                  "h-fit justify-start rounded-md p-2 text-xs text-muted-foreground hover:bg-background/50 hover:text-primary",
                  selectedIndex === i && "bg-background/50 text-primary",
                )}
              >
                <Link
                  href={`/genre/${genre.toLowerCase().split(" ").join("-")}`}
                >
                  {genre}
                </Link>
              </Button>
            ))}
        </div>
        <Button
          className="mt-3 w-full bg-muted-foreground/20 hover:bg-muted-foreground/40"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </div>
    </div>
  );
};
