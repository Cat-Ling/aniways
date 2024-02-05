import '@aniways/ui/globals.css';
import { getUser } from '@animelist/auth-next/server';
import { cn } from '@aniways/ui/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Navbar } from './navbar';
import { MyAnimeListAuthProvider } from './providers';

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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUser(cookies());

  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen', inter.className)}>
        <MyAnimeListAuthProvider session={session}>
          <Navbar />
          {children}
        </MyAnimeListAuthProvider>
      </body>
    </html>
  );
}
