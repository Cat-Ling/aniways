import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Image } from "../ui/image";
import { Play } from "lucide-react";
import { forwardRef } from "react";

type AnimeGridProps = {
  className?: string;
  children: ReactNode;
};

export const AnimeGrid = ({ children, className }: AnimeGridProps) => {
  return (
    <ul
      className={cn("grid h-full grid-cols-2 gap-3 md:grid-cols-6", className)}
    >
      {children}
    </ul>
  );
};

type AnimeGridItemProps = {
  url: string;
  poster: string;
  title: string;
  subtitle: string | ReactNode;
  type?: "horizontal" | "vertical";
};

AnimeGrid.Item = forwardRef<HTMLLIElement, AnimeGridItemProps>(
  ({ type = "vertical", ...props }: AnimeGridItemProps, ref) => {
    return (
      <li
        ref={ref}
        className="group rounded-md border border-border bg-background p-2"
      >
        <Link
          href={props.url}
          className={cn(
            "flex h-full flex-col gap-3",
            type === "horizontal" && "flex-row md:flex-col",
          )}
        >
          <div
            className={cn(
              "relative",
              type === "horizontal" && "w-1/6 md:w-full",
            )}
          >
            <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
              <Skeleton className="absolute z-0 h-full w-full rounded-md" />
              <Image
                src={props.poster}
                alt={props.title}
                width={450}
                height={650}
                className="absolute h-full w-full object-cover"
              />
            </div>
            <div
              className={cn(
                "pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-muted/70 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100",
                type === "horizontal" && "hidden md:flex",
              )}
            >
              <Play className="h-8 w-8 text-primary" />
              <p className="mt-2 text-lg font-bold text-foreground">
                Watch Now
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex flex-1 flex-col justify-between",
              type === "horizontal" && "justify-center md:justify-between",
            )}
          >
            <p
              className={cn(
                "line-clamp-2 text-xs transition group-hover:text-primary md:text-sm",
                type === "horizontal" &&
                  "group-hover:text-foreground md:group-hover:text-primary",
              )}
            >
              {props.title}
            </p>
            {typeof props.subtitle === "string" ? (
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                {props.subtitle}
              </p>
            ) : (
              props.subtitle
            )}
          </div>
        </Link>
      </li>
    );
  },
);

AnimeGrid.Item.displayName = "AnimeCard";
