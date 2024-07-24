import { Link, useRouterState } from "@tanstack/react-router";
import { Library, LogOut, Settings, Shuffle, Tv2 } from "lucide-react";

import { Button } from "@aniways/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aniways/ui/dropdown-menu";
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
      <nav className="fixed top-0 w-full border-b border-border bg-background">
        <div className="container mx-auto flex items-center justify-between gap-3 px-3 md:container">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                width={80}
                height={80}
                alt="MangaWays Logo"
                className="-ml-3 h-20 w-20"
              />
              <h1 className="text-2xl font-bold">AniWays</h1>
            </Link>
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
          <UserDropdown />
        </div>
      </nav>
      <div className="h-20" />
    </>
  );
};
