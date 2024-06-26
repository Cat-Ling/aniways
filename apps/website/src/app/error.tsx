"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Cog } from "lucide-react";
import { z } from "zod";

import { env } from "~/env";

interface ErrorPageProps {
  error: Error | undefined;
}

const HealthcheckResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  dependencies: z.object({
    myAnimeList: z.boolean(),
  }),
});

const ErrorPage = ({ error }: ErrorPageProps) => {
  const { data: isMaintenance } = useQuery({
    queryKey: ["error"],
    queryFn: () => {
      return fetch("https://healthcheck.aniways.xyz/healthcheck")
        .then(res => res.json())
        .then(data => HealthcheckResponseSchema.parse(data))
        .then(({ dependencies }) => dependencies.myAnimeList === false);
    },
  });

  if (isMaintenance) {
    return (
      <div className="container flex flex-col items-center justify-center gap-4 text-center">
        <Cog
          className="size-48 animate-spin text-muted-foreground"
          style={{
            animationDuration: "5s",
          }}
        />
        <h1 className="text-4xl font-bold">MyAnimeList Under Maintenance</h1>
        <p className="text-lg text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="size-48 text-destructive" />
      <h1 className="text-4xl font-bold">An error occurred</h1>
      <p className="text-lg text-muted-foreground">
        {}
        {env.NODE_ENV === "development" ?
          error?.message ?? "An unknown error occurred"
        : "Please try again later"}
      </p>
    </div>
  );
};

export default ErrorPage;
