'use client';

import { AlertCircle, Cog } from 'lucide-react';
import { useMemo } from 'react';

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
      <div className="container flex flex-col items-center justify-center gap-4 text-center">
        <Cog
          className="text-muted-foreground size-48 animate-spin"
          style={{
            animationDuration: '5s',
          }}
        />
        <h1 className="text-4xl font-bold">MyAnimeList Under Maintenance</h1>
        <p className="text-muted-foreground text-lg">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="text-destructive size-48" />
      <h1 className="text-4xl font-bold">An error occurred</h1>
      <p className="text-muted-foreground text-lg">
        {/* eslint-disable-next-line turbo/no-undeclared-env-vars */}
        {process.env.NODE_ENV === 'development' ?
          error.message ?? 'An unknown error occurred'
        : 'Please try again later'}
      </p>
    </div>
  );
};

export default ErrorPage;
