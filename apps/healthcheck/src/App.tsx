import { Suspense } from "react";

import { Header } from "./components/Header";
import { HealthCheckTable } from "./components/HealthCheckTable";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <img
            src="/logo.png"
            alt="Aniways Logo"
            className="size-80 animate-bounce"
          />
        </div>
      }
    >
      <Header />
      <div className="container mb-6 flex w-full flex-col justify-between gap-3 px-3 pt-6 md:container">
        <h1 className="text-lg font-bold md:text-2xl">Health Check</h1>
        <HealthCheckTable />
      </div>
    </Suspense>
  );
}

export default App;
