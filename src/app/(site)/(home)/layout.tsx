import { ContinueWatching } from "@/components/anime/continue-watching";
import { type ReactNode } from "react";

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <ContinueWatching />
      {children}
    </>
  );
};

export default HomeLayout;
