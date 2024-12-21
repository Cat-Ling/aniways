import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Viewport, type Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/navigation/footer";

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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <div className="min-h-screen">
          <NextTopLoader showSpinner={false} color="#e11d48" />
          <Providers>
            {children}
            <Toaster richColors={true} />
          </Providers>
        </div>
        <Footer />
      </body>
    </html>
  );
}
