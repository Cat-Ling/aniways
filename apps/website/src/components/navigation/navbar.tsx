"use client";

import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, Home, Menu, Shuffle } from "lucide-react";

import { useAuth } from "@aniways/auth/react";
import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@aniways/ui/sheet";
import { Skeleton } from "@aniways/ui/skeleton";

import { env } from "~/env";
import { LoginModal } from "../auth/login-modal";
import { ProfileDropdown } from "../auth/profile-dropdown";
import { ProfileHeader } from "./profile-header";
import { SearchBar, SearchBarFallback } from "./search-bar";
import { SearchBtn } from "./search-btn";

const UserButtons = (props: { mobile?: boolean }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="size-12 rounded-full" />;
  }

  if (user) {
    return <ProfileDropdown mobile={props.mobile} />;
  }

  return (
    <SheetClose asChild>
      <LoginModal mobile={props.mobile} />
    </SheetClose>
  );
};

export const Navbar = () => {
  return (
    <>
      <Sheet>
        <nav className="fixed top-0 z-10 w-full border-b border-border bg-background">
          <div className="container mx-auto flex items-center justify-between px-3 md:container">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <span className="sr-only">Open menu</span>
                    <Menu />
                  </Button>
                </SheetTrigger>
                <Link href="/" className="flex items-center" scroll={false}>
                  <Image
                    src="/logo.png"
                    width={80}
                    height={80}
                    alt="AniWays Logo"
                    className="-ml-3 size-16 md:size-20"
                  />
                  <h1 className="text-2xl font-bold">AniWays</h1>
                </Link>
              </div>
              <div className="hidden items-center gap-6 md:flex">
                <Suspense fallback={<SearchBarFallback />}>
                  <SearchBar />
                </Suspense>
                <Button asChild variant={"navlink"}>
                  <a
                    href={
                      env.NODE_ENV === "development" ?
                        "http://localhost:5173"
                      : "https://manga.aniways.xyz"
                    }
                  >
                    <BookOpen className="mr-2 size-4" />
                    Read Manga
                  </a>
                </Button>
                <Button asChild variant={"navlink"}>
                  <a href="/random">
                    <Shuffle className="mr-2 size-4" />
                    Random
                  </a>
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <SearchBtn />
            </div>
            <div className="hidden md:block">
              <UserButtons />
            </div>
          </div>
        </nav>
        <SheetContent side="left">
          <SheetHeader className="mb-4">
            <ProfileHeader />
          </SheetHeader>
          <div className="space-y-3">
            <SheetClose asChild>
              <Button
                asChild
                variant={"navlink"}
                className="h-fit w-full justify-start"
              >
                <Link href={"/"}>
                  <Home className="mr-2 size-4" />
                  Home
                </Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                asChild
                variant={"navlink"}
                className="h-fit w-full justify-start"
              >
                <a
                  href={
                    env.NODE_ENV === "development" ?
                      "http://localhost:5173"
                    : "https://manga.aniways.xyz"
                  }
                >
                  <BookOpen className="mr-2 size-4" />
                  Read Manga
                </a>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                asChild
                variant={"navlink"}
                className="h-fit w-full justify-start"
              >
                <a href="/random">
                  <Shuffle className="mr-2 size-4" />
                  Random
                </a>
              </Button>
            </SheetClose>
            <UserButtons mobile={true} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="h-16 md:h-20" />
    </>
  );
};
