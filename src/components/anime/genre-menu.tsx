"use client";

import { type RouterOutputs } from "@/trpc/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type GenreMenuProps = {
  genres: RouterOutputs["hiAnime"]["getGenres"];
};

export const GenreMenu = ({ genres }: GenreMenuProps) => {
  const [showMore, setShowMore] = useState(false);
  const colors = useMemo(
    () => [
      "text-[#FF6B6B] hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B]",
      "text-[#48BB78] hover:bg-[#48BB78]/20 hover:text-[#48BB78]",
      "text-[#F6E05E] hover:bg-[#F6E05E]/20 hover:text-[#F6E05E]",
      "text-[#63B3ED] hover:bg-[#63B3ED]/20 hover:text-[#63B3ED]",
      "text-[#F687B3] hover:bg-[#F687B3]/20 hover:text-[#F687B3]",
      "text-[#9F7AEA] hover:bg-[#9F7AEA]/20 hover:text-[#9F7AEA]",
      "text-[#F6AD55] hover:bg-[#F6AD55]/20 hover:text-[#F6AD55]",
      "text-[#4FD1C5] hover:bg-[#4FD1C5]/20 hover:text-[#4FD1C5]",
    ],
    [],
  );

  return (
    <div className="flex w-full flex-col gap-3">
      <h1 className="text-lg font-bold md:text-2xl">Genres</h1>
      <div className="rounded-md bg-muted p-3">
        <div className="grid w-full grid-cols-3 gap-3">
          {genres.slice(0, 24).map((genre, i) => (
            <Button
              key={genre}
              variant="ghost"
              asChild
              className={cn(
                "h-fit justify-start rounded-md p-2 text-xs text-muted-foreground hover:bg-background/50 hover:text-muted-foreground",
                colors[i % colors.length],
              )}
            >
              <Link href={`/genre/${genre.toLowerCase().split(" ").join("-")}`}>
                {genre}
              </Link>
            </Button>
          ))}
          {genres.slice(showMore ? 24 : genres.length).map((genre, i) => (
            <Button
              key={genre}
              variant="ghost"
              asChild
              className={cn(
                "h-fit justify-start rounded-md p-2 text-xs text-muted-foreground hover:bg-background/50 hover:text-muted-foreground",
                colors[i % colors.length],
              )}
            >
              <Link href={`/genre/${genre.toLowerCase().split(" ").join("-")}`}>
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
