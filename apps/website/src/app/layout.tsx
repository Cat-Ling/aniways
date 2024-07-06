import "@aniways/ui/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@aniways/ui/sonner";

import { DevToolsDetector } from "~/components/devtools-detector";
import { Footer } from "~/components/navigation/footer";
import { Navbar } from "~/components/navigation/navbar";
import { Providers } from "~/components/providers";
import { ThemeSetter } from "~/components/theme/theme-setter";

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
  // to disable zooming on ios devices on input focus
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          <NextTopLoader showSpinner={false} color="#e11d48" />
          <Providers>
            <Navbar />
            {children}
            <Toaster richColors={true} />
            <ThemeSetter />
          </Providers>
        </div>
        <Footer />
        <DevToolsDetector />
      </body>
    </html>
  );
}
