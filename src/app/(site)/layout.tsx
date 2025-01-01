import type { ReactNode } from "react";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  return <main className="min-h-full px-3 pt-6 md:container">{children}</main>;
};

export default SiteLayout;
