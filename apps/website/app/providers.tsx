'use client';

import {
  SessionProvider,
  SessionProviderProps,
} from '@animelist/auth-next/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState, FC } from 'react';

type ProvidersProps = SessionProviderProps;

export const Providers: FC<ProvidersProps> = props => {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <SessionProvider {...props} />
    </QueryClientProvider>
  );
};
