import { Button } from '@aniways/ui/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { SearchBar } from './search-bar';
import { getServerSession } from '@animelist/auth-next/server';
import { cookies } from 'next/headers';

export const Navbar = async () => {
  const user = await getServerSession(cookies());

  return (
    <nav className="bg-background border-border border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              width={80}
              height={80}
              alt="AniWays Logo"
              className="-ml-3 h-20 w-20"
            />
            <h1 className="text-2xl font-bold">AniWays</h1>
          </Link>
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          {user ?
            <>
              <Button variant="ghost" asChild>
                <Link href="/anime-list">Anime List</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
            </>
          : <>
              <Button variant="secondary" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </>
          }
        </div>
      </div>
    </nav>
  );
};
