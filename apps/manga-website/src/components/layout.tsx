import type { ReactNode } from "react";

import { cn } from "@aniways/ui";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export const MainLayout = (props: MainLayoutProps) => {
  return (
    <div
      className={cn(
        "container mx-auto h-full min-h-full px-3 pt-6 md:container",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
