"use client";

import Link from "next/link";
import { List, LogOut, Settings } from "lucide-react";

import { signOut, useAuth } from "@aniways/auth/react";
import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aniways/ui/dropdown-menu";
import { SheetClose } from "@aniways/ui/sheet";

export const ProfileDropdown = ({ mobile }: { mobile?: boolean }) => {
  const user = useAuth();

  if (!user.user) return null;

  if (mobile) {
    return (
      <>
        <SheetClose asChild>
          <Button
            asChild
            variant="navlink"
            className="h-fit w-full justify-start"
          >
            <Link href={"/anime-list"}>
              <List className="mr-2 size-4" />
              Anime List
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            asChild
            variant="navlink"
            className="h-fit w-full justify-start"
          >
            <Link href={"/settings"}>
              <Settings className="mr-2 size-4" />
              Settings
            </Link>
          </Button>
        </SheetClose>
        <DropdownMenuSeparator />
        <SheetClose asChild>
          <Button
            variant="navlink"
            className="h-fit w-full justify-start"
            onClick={() => {
              signOut({
                redirectUrl: window.location.href,
              });
            }}
          >
            <LogOut className="mr-2 size-4" />
            Log Out
          </Button>
        </SheetClose>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={user.user.picture}
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{user.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/anime-list"}>
            <List className="mr-2 h-5 w-5" />
            Anime List
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/settings"}>
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut({
              redirectUrl: window.location.href,
            });
          }}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
