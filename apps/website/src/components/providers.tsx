"use client";

import type { FC } from "react";

import type { AuthProviderProps } from "@aniways/auth/react";
import { AuthProvider } from "@aniways/auth/react";

import { TRPCReactProvider } from "~/trpc/react";

type ProvidersProps = AuthProviderProps;

export const Providers: FC<ProvidersProps> = props => {
  return (
    <TRPCReactProvider>
      <AuthProvider {...props} />
    </TRPCReactProvider>
  );
};
