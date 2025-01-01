"use client";

import { env } from "@/env";
import { AlertCircle } from "lucide-react";

interface ErrorPageProps {
  error: Error | undefined;
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="size-48 text-destructive" />
      <h1 className="text-4xl font-bold">An error occurred</h1>
      <p className="text-lg text-muted-foreground">
        {env.NODE_ENV === "development"
          ? (error?.message ?? "An unknown error occurred")
          : "Please try again later"}
      </p>
    </div>
  );
};

export default ErrorPage;
