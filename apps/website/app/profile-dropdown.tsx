'use client';

import { Image } from '@aniways/ui/components/ui/aniways-image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@aniways/ui/components/ui/dropdown-menu';
import { List, LogOut, User } from 'lucide-react';
import { signOut, useAuth } from '@myanimelist/auth';

export const ProfileDropdown = () => {
  const user = useAuth();

  if (!user || !user.user) return null;

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
          <Link href={'/anime-list'}>
            <List className="mr-2 h-5 w-5" />
            Anime List
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={'/profile'}>
            <User className="mr-2 h-5 w-5" />
            Profile
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
