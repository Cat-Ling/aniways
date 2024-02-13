import { ReactNode } from 'react';

type SiteLayoutProps = {
  children: ReactNode;
};

const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <main className="container mx-auto h-full min-h-screen px-3 pt-6 md:container">
      {children}
    </main>
  );
};

export default SiteLayout;
