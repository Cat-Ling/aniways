"use client";

import type { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useOptimistic } from "react";

import type { MyAnimeListServiceTypes } from "@aniways/data";

type Metadata = MyAnimeListServiceTypes.AnimeMetadata;

type SetMetadata = Dispatch<SetStateAction<Metadata>>;

const MetadataContext = createContext<[Metadata, SetMetadata] | undefined>(
  undefined,
);

export const useMetadata = () => {
  const metadata = useContext(MetadataContext);

  if (!metadata) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }

  return metadata;
};

export const MetadataProvider: FC<{
  metadata: Metadata;
  children: ReactNode;
}> = (props) => {
  const [metadata, setMetadata] = useOptimistic(props.metadata);

  return (
    <MetadataContext.Provider value={[metadata, setMetadata]}>
      {props.children}
    </MetadataContext.Provider>
  );
};
