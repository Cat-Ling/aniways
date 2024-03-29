import { auth } from '@aniways/myanimelist';
import { cn } from '@aniways/ui/lib/utils';
import { Toaster } from '@ui/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { Navbar } from './navbar';
import { Providers } from './providers';
import '@aniways/ui/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AniWays',
    template: '%s | AniWays',
  },
  description: 'Another anime website but with a MyAnimeList Integration',
  icons: {
    icon: '/favicon',
  },
  metadataBase: new URL('https://aniways.vercel.app'),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(cookies());

  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen', inter.className)}>
        <NextTopLoader showSpinner={false} color="#e11d48" />
        <Providers session={session}>
          <Navbar />
          {children}
          <Toaster richColors={true} />
        </Providers>
      </body>
    </html>
  );
}
