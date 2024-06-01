import Link from 'next/link';
import { Image } from '@aniways/ui/components/ui/aniways-image';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-border mt-12 border-t">
      <div className="mx-auto w-full max-w-screen-xl p-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="mb-4 flex items-center sm:mb-0 rtl:space-x-reverse"
          >
            <Image src="/logo.png" alt="Aniways Logo" width={64} height={64} />
            <span className="text-foreground self-center whitespace-nowrap text-2xl font-semibold">
              Aniways
            </span>
          </Link>
          <ul className="text-muted-foreground mb-6 flex flex-wrap items-center text-sm font-medium sm:mb-0">
            <li>
              <Link href="/about" className="me-4 hover:underline md:me-6">
                About
              </Link>
            </li>
            <li>
              <Link
                href="https://healthcheck.aniways.xyz"
                className="me-4 hover:underline md:me-6"
                target="_blank"
              >
                Health Check
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="me-4 hover:underline md:me-6">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <hr className="border-border mb-6 mt-4 sm:mx-auto" />
        <span className="text-muted-foreground mb-3 block text-xs sm:text-center">
          This site does not store any data. All data is provided by
          non-affiliated third parties.
        </span>
        <span className="text-muted-foreground block text-sm sm:text-center">
          © {currentYear}{' '}
          <Link href="/" className="hover:underline">
            Aniways
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
