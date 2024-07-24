import { Button } from "@aniways/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@aniways/ui/dropdown-menu";

import { api } from "../trpc";

const UserDropdown = () => {
  const { data: session, isLoading } = api.auth.getSession.useQuery();

  if (isLoading || !session?.user) return null;

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Navbar = () => {
  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between gap-3 px-3 md:container">
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            width={80}
            height={80}
            alt="AniWays Logo"
            className="-ml-3 h-20 w-20"
          />
          <h1 className="text-2xl font-bold">Aniways Manga</h1>
        </a>

        <div className="flex items-center gap-3">
          <Button asChild variant={"secondary"}>
            <a
              href={
                // eslint-disable-next-line turbo/no-undeclared-env-vars
                import.meta.env.DEV ?
                  "http://localhost:3000"
                : "https://aniways.xyz"
              }
            >
              Anime
            </a>
          </Button>
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
};
