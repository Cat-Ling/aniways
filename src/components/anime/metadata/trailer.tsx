import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/trpc/react";

interface TrailerProps {
  malId: number;
  title: string;
}

export const Trailer = ({ malId, title }: TrailerProps) => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button variant={"secondary"}>View Trailer</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Trailer - {title}</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Suspense fallback={<Skeleton className="aspect-video w-full" />}>
            <TrailerContent malId={malId} />
          </Suspense>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

const TrailerContent = ({ malId }: Pick<TrailerProps, "malId">) => {
  const [trailer] = api.mal.getTrailer.useSuspenseQuery({
    malId,
  });

  if (!trailer) {
    return <div>Trailer not found</div>;
  }

  return (
    <iframe
      className="aspect-video w-full"
      src={trailer}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};
