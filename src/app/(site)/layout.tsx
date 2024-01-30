import { ReactNode } from 'react';

type SiteLayoutProps = {
  children: ReactNode;
};

const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <main className="min-h-screen h-full container mx-auto pt-6">
      {children}
    </main>
  );
};

export default SiteLayout;
