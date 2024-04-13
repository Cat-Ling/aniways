'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const RefetchOnWindowFocus = () => {
  const { refresh } = useRouter();

  useEffect(() => {
    window.addEventListener('focus', refresh);

    return () => {
      window.removeEventListener('focus', refresh);
    };
  }, [refresh]);

  return <></>;
};
