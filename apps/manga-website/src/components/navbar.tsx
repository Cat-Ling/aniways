import { Link, useRouterState } from "@tanstack/react-router";
import { Library, LogOut, Menu, Settings, Shuffle, Tv2 } from "lucide-react";

import { Button } from "@aniways/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aniways/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@aniways/ui/sheet";
import { Skeleton } from "@aniways/ui/skeleton";

import { api } from "../trpc";
import { LoginModal } from "./login-modal";
import { SearchBar } from "./search-bar";

const UserDropdown = () => {
  const routerState = useRouterState();
  const { data: session, isLoading } = api.auth.getSession.useQuery();

  if (isLoading) {
    return <Skeleton className="h-12 w-12 rounded-full" />;
  }

  if (!session) {
    return <LoginModal />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <img
          src={session.user.picture}
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/library">
            <Library className="mr-2 size-4" />
            Your Library
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={
              // eslint-disable-next-line turbo/no-undeclared-env-vars
              import.meta.env.DEV ?
                `http://localhost:3000/auth/signout?redirect=${window.location.origin + routerState.location.href}`
              : `https://aniways.xyz/auth/signout?redirect=${window.location.origin + routerState.location.href}`
            }
          >
            <LogOut className="mr-2 size-4" />
            Log Out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Navbar = () => {
  return (
    <>
      <Sheet>
        <nav className="fixed top-0 z-10 w-full border-b border-border bg-background">
          <div className="container mx-auto flex items-center justify-between gap-3 px-3 md:container">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <SheetTrigger asChild>
                  <Button variant={"ghost"} size="icon" className="md:hidden">
                    <span className="sr-only">Menu</span>
                    <Menu />
                  </Button>
                </SheetTrigger>
                <Link to="/" className="flex items-center">
                  <img
                    src="/logo.png"
                    width={80}
                    height={80}
                    alt="MangaWays Logo"
                    className="-ml-3 size-16 md:size-20"
                  />
                  <h1 className="text-2xl font-bold">AniWays</h1>
                </Link>
              </div>
              <div className="hidden items-center gap-6 md:flex">
                <SearchBar />
                <Button asChild variant={"navlink"}>
                  <a
                    href={
                      // eslint-disable-next-line turbo/no-undeclared-env-vars
                      import.meta.env.DEV ?
                        "http://localhost:3000"
                      : "https://aniways.xyz"
                    }
                  >
                    <Tv2 className="mr-2 size-4" />
                    Watch Anime
                  </a>
                </Button>
                <Button asChild variant="navlink">
                  <Link to="/random">
                    <Shuffle className="mr-2 size-4" />
                    Random
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <SearchBar mobile />
            </div>
            <div className="hidden md:block">
              <UserDropdown />
            </div>
          </div>
        </nav>
        <SheetContent side="left"></SheetContent>
      </Sheet>
      <div className="h-16 md:h-20" />
    </>
  );
};
