import Link from "next/link";

import { Image } from "@aniways/ui/aniways-image";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border bg-background">
      <div className="mx-auto w-full max-w-screen-xl p-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="mb-4 flex items-center sm:mb-0 rtl:space-x-reverse"
          >
            <Image src="/logo.png" alt="Aniways Logo" width={64} height={64} />
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-foreground">
              Aniways
            </span>
          </Link>
          <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-muted-foreground sm:mb-0">
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
        <hr className="mb-6 mt-4 border-border sm:mx-auto" />
        <span className="mb-3 block text-xs text-muted-foreground sm:text-center">
          This site does not store any data. All data is provided by
          non-affiliated third parties.
        </span>
        <span className="block text-sm text-muted-foreground sm:text-center">
          © {currentYear}{" "}
          <Link href="/" className="hover:underline">
            Aniways
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
