'use client';

import { AlertCircle, Cog } from 'lucide-react';
import React, { useMemo } from 'react';

type ErrorPageProps = {
  error: Error;
};

const ErrorPage = ({ error }: ErrorPageProps) => {
  const isMaintenance = useMemo(() => {
    let json;

    try {
      json = JSON.parse(error.message);
    } catch (e) {
      return false;
    }

    if (!(json instanceof Object)) return false;

    if (!('error' in json)) return false;

    return json.error === 'maintenance';
  }, [error]);

  if (isMaintenance) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <Cog
          className="text-muted-foreground size-48 animate-spin"
          style={{
            animationDuration: '5s',
          }}
        />
        <h1 className="text-4xl font-bold">Under Maintenance</h1>
        <p className="text-muted-foreground text-lg">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="text-destructive size-48" />
      <h1 className="text-4xl font-bold">An error occurred</h1>
      <p className="text-muted-foreground text-lg">
        {error.message || 'An unknown error occurred'}
        <br />
        Please try again later
      </p>
    </div>
  );
};

export default ErrorPage;
