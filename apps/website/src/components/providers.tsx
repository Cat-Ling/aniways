"use client";

import type { FC } from "react";
import { ThemeProvider } from "next-themes";

import type { AuthProviderProps } from "@aniways/auth/react";
import { AuthProvider } from "@aniways/auth/react";

import { TRPCReactProvider } from "~/trpc/react";

type ProvidersProps = AuthProviderProps;

export const Providers: FC<ProvidersProps> = props => {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider {...props} />
      </ThemeProvider>
    </TRPCReactProvider>
  );
};
