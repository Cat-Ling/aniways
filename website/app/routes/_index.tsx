import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <nav className="fixed top-0 z-10 w-full border-b border-border bg-background">
        <div className="container mx-auto flex items-center justify-between p-3 px-6 md:px-0">
          <Link to="/" className="flex items-center">
            <img
              src="/aniways-logo.png"
              alt="AniWays Logo"
              className="-ml-3 size-12 md:size-14"
            />
            <h1 className="text-2xl md:text-3xl font-bold">AniWays</h1>
          </Link>
        </div>
      </nav>
    </div>
  );
}
