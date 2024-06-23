import { Suspense } from "react";

import { HealthCheckTable } from "./components/HealthCheckTable";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <img
            src="https://aniways.xyz/logo.png"
            alt="Aniways Logo"
            className="h-20 w-20 animate-bounce"
          />
        </div>
      }
    >
      <Navbar />
      <div className="mb-6 flex w-full flex-col justify-between gap-3 pt-6 md:mb-5 md:flex-row md:items-center md:gap-0">
        <h1 className="text-lg font-bold md:text-2xl">Health Check</h1>
        <HealthCheckTable />
      </div>
    </Suspense>
  );
}

export default App;
