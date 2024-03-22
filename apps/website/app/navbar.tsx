import { Image } from '@aniways/ui/components/ui/aniways-image';
import Link from 'next/link';
import { SearchBar } from './search-bar';
import { auth } from '@aniways/myanimelist';
import { cookies } from 'next/headers';
import { LoginModal } from './login-modal';
import { ProfileDropdown } from './profile-dropdown';

export const Navbar = async () => {
  const user = await auth(cookies());

  return (
    <nav className="bg-background border-border border-b">
      <div className="container mx-auto flex justify-between px-3 md:container md:items-center">
        <div className="flex items-center gap-6">
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
        <div className="flex items-center gap-3">
          <div className="flex gap-3">
            {user ?
              <ProfileDropdown />
            : <LoginModal />}
          </div>
        </div>
      </div>
      <div className="mb-3 block px-3 md:hidden">
        <SearchBar />
      </div>
    </nav>
  );
};
