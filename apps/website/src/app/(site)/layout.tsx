import { ReactNode } from 'react';

type SiteLayoutProps = {
  children: ReactNode;
};

const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <main className="container mx-auto h-full min-h-screen pt-6">
      {children}
    </main>
  );
};

export default SiteLayout;
