"use client";

import { TRPCReactProvider } from "@/trpc/react";
import {
  SessionProvider,
  type SessionProviderProps,
} from "@animelist/auth-next/client";
import { ThemeProvider } from "next-themes";
import { type FC } from "react";

export const Providers: FC<SessionProviderProps> = (props) => {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider {...props} />
      </ThemeProvider>
    </TRPCReactProvider>
  );
};
