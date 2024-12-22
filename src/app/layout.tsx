import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { type Viewport, type Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/navigation/footer";
import { Navbar } from "@/components/navigation/navbar";
import { ThemeSetter } from "@/components/theme-setter";

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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
      </body>
    </html>
  );
}
