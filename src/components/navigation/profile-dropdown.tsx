"use client";

import { useAuth } from "@/hooks/auth";
import { SheetClose } from "../ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import { List, LogOut, Settings } from "lucide-react";
import { Image } from "../ui/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const ProfileDropdown = ({ mobile }: { mobile?: boolean }) => {
  const { session, signOut } = useAuth();

  if (!session.user) return null;

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
          src={session.user.picture}
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
          alt={`Profile picture of ${session.user.name}`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
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
