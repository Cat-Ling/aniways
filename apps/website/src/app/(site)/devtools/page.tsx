import Link from "next/link";

import { Button } from "@aniways/ui/button";

const DevtoolsDetectedPage = () => {
  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold">Devtools Detected</h1>
      <p className="mt-3 text-muted-foreground">
        We have detected that you have your devtools open. Please close them to
        continue.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">I have closed the devtools</Link>
      </Button>
    </div>
  );
};

export default DevtoolsDetectedPage;
