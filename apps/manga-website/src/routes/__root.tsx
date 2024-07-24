import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Navbar } from "../components/navbar";

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
      {/* eslint-disable-next-line turbo/no-undeclared-env-vars */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
});
