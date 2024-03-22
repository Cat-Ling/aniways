import { Image } from '@aniways/ui/components/ui/aniways-image';
import Link from 'next/link';
import { SearchBar } from './search-bar';
import { auth } from '@aniways/myanimelist';
import { cookies } from 'next/headers';
import { LoginModal } from './login-modal';
import { LogoutModal } from './logout-modal';

export const Navbar = async () => {
  const user = await auth(cookies());

  return (
    <nav className="bg-background border-border border-b">
      <div className="container mx-auto flex flex-col justify-between px-3 md:container md:flex-row md:items-center">
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <Link href="/" className="flex items-center" scroll={false}>
            <Image
              src="/logo.png"
              width={80}
              height={80}
              alt="AniWays Logo"
              className="-ml-3 h-20 w-20"
            />
            <h1 className="text-2xl font-bold">AniWays</h1>
          </Link>
          <div className="hidden md:block">
            <SearchBar />
          </div>
        </div>
        <div className="mb-3 flex flex-col gap-3 md:m-0 md:flex-row md:items-center">
          <div className="block md:hidden">
            <SearchBar />
          </div>
          <div className="flex gap-3">
            {user ?
              <LogoutModal />
            : <LoginModal />}
          </div>
        </div>
      </div>
    </nav>
  );
};
