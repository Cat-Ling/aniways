import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
        <Outlet />
      </div>
      <Footer />
      {/* eslint-disable-next-line turbo/no-undeclared-env-vars */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}
