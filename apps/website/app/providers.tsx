'use client';

import { AuthProvider, AuthProviderProps } from '@aniways/auth';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState, FC } from 'react';

type ProvidersProps = AuthProviderProps;

export const Providers: FC<ProvidersProps> = props => {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <AuthProvider {...props} />
    </QueryClientProvider>
  );
};
