"use client";

import type { HTMLProps } from "react";
import { useState } from "react";

import { cn } from "@aniways/ui";

type ImageProps = HTMLProps<HTMLImageElement>;

export const Image = (props: ImageProps) => {
  const [error, setError] = useState(false);

  return (
    <img
      {...props}
      loading="lazy"
      onError={setError.bind(null, true)}
      className={cn(props.className, error && "bg-background")}
    />
  );
};
