import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            width={72}
            height={72}
            alt="AniWays Logo"
            className="-ml-3"
          />
          <h1 className="text-2xl font-bold">AniWays</h1>
        </Link>
        <div className="flex gap-3 items-center">
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
