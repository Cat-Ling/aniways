'use client';

import { cn } from '@ui/lib/utils';
import { HTMLProps, useState } from 'react';

type ImageProps = HTMLProps<HTMLImageElement>;

export const Image = (props: ImageProps) => {
  const [error, setError] = useState(false);

  return (
    <img
      {...props}
      loading="lazy"
      onError={setError.bind(null, true)}
      className={cn(props.className, error && 'bg-background')}
    />
  );
};
