import { Button } from '@aniways/ui/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { SearchBar } from './search-bar';

export const Navbar = () => {
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
          <Button variant="secondary" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
