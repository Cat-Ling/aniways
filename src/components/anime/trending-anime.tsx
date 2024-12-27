"use client";

import { type RouterOutputs } from "@/trpc/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image } from "../ui/image";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TrendingAnimeProps = {
  trendingAnime: RouterOutputs["hiAnime"]["getTrendingAnime"];
};

export const TrendingAnime = ({ trendingAnime }: TrendingAnimeProps) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="hidden md:block">
        <TrendingAnimeDesktop key={windowWidth} trendingAnime={trendingAnime} />
      </div>
      <div className="md:hidden">
        <TrendingAnimeMobile
          key={windowWidth + "mobile"}
          trendingAnime={trendingAnime}
        />
      </div>
    </>
  );
};

const TrendingAnimeDesktop = ({ trendingAnime }: TrendingAnimeProps) => {
  const [scrollValue, setScrollValue] = useState(0);
  const container = useRef<HTMLDivElement>(null);

  const width = useMemo(() => {
    const { width } = document
      .querySelector("main div")!
      .getBoundingClientRect();

    return (width - 56) / 5 - 16;
  }, []);

  const imageWidth = useMemo(() => {
    return width - 28;
  }, [width]);

  const height = useMemo(() => {
    // 3/4 ratio
    return imageWidth * (4 / 3);
  }, [imageWidth]);

  useEffect(() => {
    if (!container.current) return;

    container.current.scrollTo({ left: scrollValue, behavior: "smooth" });
  }, [scrollValue]);

  return (
    <div className="mb-6 w-full">
      <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">Trending</h1>
      <div className="flex w-full gap-2">
        <div
          ref={container}
          className="flex w-full max-w-full gap-4 md:overflow-hidden"
        >
          {trendingAnime.map((anime, i) => (
            <div
              key={anime.id}
              className="flex flex-shrink-0 gap-2"
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              <div className="flex h-full flex-1 flex-col items-center justify-end">
                <h2 className="rotate-180 truncate text-lg font-bold [writing-mode:vertical-rl]">
                  {anime.jname ?? anime.name}
                </h2>
                <p className="text-lg font-bold text-primary">
                  {`0${i + 1}`.slice(-2)}
                </p>
              </div>
              <Image
                src={anime.poster ?? ""}
                width={imageWidth}
                height={height}
                alt={anime.jname ?? anime.name ?? ""}
                className="rounded-md"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant={"secondary"}
            className="flex-1 [&_svg]:size-5"
            onClick={() => setScrollValue(scrollValue + width + 16)}
            disabled={scrollValue / (width + 16) >= trendingAnime.length - 5}
          >
            <ChevronRight />
          </Button>
          <Button
            variant={"secondary"}
            className="flex-1 [&_svg]:size-5"
            onClick={() => setScrollValue(scrollValue - width - 16)}
            disabled={scrollValue - width - 16 < 0}
          >
            <ChevronLeft />
          </Button>
        </div>
      </div>
    </div>
  );
};

const TrendingAnimeMobile = ({ trendingAnime }: TrendingAnimeProps) => {
  return (
    <div className="mb-6 w-full">
      <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">Trending</h1>
      <div className="flex w-full overflow-scroll">
        {trendingAnime.map((anime, i) => (
          <div key={anime.id} className="relative w-[calc(25%)] flex-shrink-0">
            <Image
              src={anime.poster ?? ""}
              alt={anime.jname ?? anime.name ?? ""}
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="absolute left-0 top-0 bg-primary p-2">
              <p className="font-bold text-foreground">
                {`0${i + 1}`.slice(-2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
