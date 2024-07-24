import { createRouter, RouterProvider } from "@tanstack/react-router";

import { TRPCReactProvider } from "./components/providers";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  return (
    <TRPCReactProvider>
      <RouterProvider router={router} />
    </TRPCReactProvider>
  );
};
