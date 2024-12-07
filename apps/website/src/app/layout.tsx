import "@aniways/ui/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AlertTriangle } from "lucide-react";
import NextTopLoader from "nextjs-toploader";

import { Alert, AlertDescription, AlertTitle } from "@aniways/ui/alert";
import { Toaster } from "@aniways/ui/sonner";

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
  appleWebApp: {
    title: "AniWays",
    statusBarStyle: "black-translucent",
    capable: true,
    startupImage: "/logo.jpg",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.jpg",
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
            <Alert className="container mx-auto mt-4" variant={"destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No new episodes</AlertTitle>
              <AlertDescription>
                We are working on a fix sorry for the inconvenience
              </AlertDescription>
            </Alert>
            {children}
            <Toaster richColors={true} />
            <ThemeSetter />
          </Providers>
        </div>
        <Footer />
      </body>
    </html>
  );
}
