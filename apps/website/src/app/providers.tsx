"use client";

import type { FC } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { AuthProviderProps } from "@aniways/auth";
import { AuthProvider } from "@aniways/auth";

type ProvidersProps = AuthProviderProps;

export const Providers: FC<ProvidersProps> = props => {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <AuthProvider {...props} />
    </QueryClientProvider>
  );
};
