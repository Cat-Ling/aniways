'use client';

import { Image } from '@aniways/ui/components/ui/aniways-image';
import Link from 'next/link';
import { SearchBar, SearchBarFallback } from './search-bar';
import { useAuth } from '@aniways/auth';
import { LoginModal } from './login-modal';
import { ProfileDropdown } from './profile-dropdown';
import { Skeleton } from '@aniways/ui/components/ui/skeleton';
import { Suspense } from 'react';

const UserButtons = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="size-12 rounded-full" />;
  }

  if (user) {
    return <ProfileDropdown />;
  }

  return <LoginModal />;
};

export const Navbar = () => {
  return (
    <nav className="bg-background border-border border-b">
      <div className="container mx-auto flex items-center justify-between px-3 md:container">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center" scroll={false}>
            <Image
              src="/logo.png"
              width={80}
              height={80}
              alt="AniWays Logo"
              className="-ml-3 h-20 w-20"
            />
            <h1 className="text-2xl font-bold">AniWays</h1>
          </Link>
          <div className="hidden md:block">
            <Suspense fallback={<SearchBarFallback />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
        <UserButtons />
      </div>
      <div className="mb-3 block px-3 md:hidden">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </div>
    </nav>
  );
};
