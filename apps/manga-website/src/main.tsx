import "./index.css";

import React from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { TRPCReactProvider } from "./components/providers";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TRPCReactProvider>
      <RouterProvider router={router} />
    </TRPCReactProvider>
  </React.StrictMode>
);
