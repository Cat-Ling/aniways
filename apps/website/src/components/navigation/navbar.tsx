"use client";

import { Suspense } from "react";
import Link from "next/link";

import { useAuth } from "@aniways/auth/react";
import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import { Skeleton } from "@aniways/ui/skeleton";

import { env } from "~/env";
import { LoginModal } from "../auth/login-modal";
import { ProfileDropdown } from "../auth/profile-dropdown";
import { SearchBar, SearchBarFallback } from "./search-bar";

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
    <nav className="border-b border-border bg-background">
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
        <div className="flex items-center gap-3">
          <Button asChild variant={"secondary"}>
            <a
              href={
                env.NODE_ENV === "development" ?
                  "http://localhost:5173"
                : "https://manga.aniways.xyz"
              }
            >
              Manga
            </a>
          </Button>
          <UserButtons />
        </div>
      </div>
      <div className="mb-3 block px-3 md:hidden">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </div>
    </nav>
  );
};
