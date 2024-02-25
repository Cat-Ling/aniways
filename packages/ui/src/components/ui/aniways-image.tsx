import { HTMLProps } from 'react';

type ImageProps = HTMLProps<HTMLImageElement>;

export const Image = (props: ImageProps) => {
  return <img {...props} />;
};
