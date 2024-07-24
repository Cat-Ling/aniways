import { QueryClientProvider } from "@tanstack/react-query";

import { useTrpc } from "../hooks/use-trpc";
import { api } from "../trpc";

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const { trpcClient, queryClient } = useTrpc();

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
