import "@aniways/ui/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@aniways/ui/sonner";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AniWays",
    template: "%s | AniWays",
  },
  description: "Another anime website but with a MyAnimeList Integration",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "black",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen">
          <NextTopLoader showSpinner={false} color="#e11d48" />
          <Providers>
            <Navbar />
            {children}
            <Toaster richColors={true} />
          </Providers>
        </div>
        <Footer />
      </body>
    </html>
  );
}
