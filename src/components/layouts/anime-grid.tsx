import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

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
