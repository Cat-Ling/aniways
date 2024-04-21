'use client';

import { getAnimeMetadataFromMAL } from '@aniways/data';
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useOptimistic,
} from 'react';

type Metadata = Exclude<
  Awaited<ReturnType<typeof getAnimeMetadataFromMAL>>,
  undefined
>;

type SetMetadata = Dispatch<SetStateAction<Metadata>>;

const MetadataContext = createContext<[Metadata, SetMetadata] | undefined>(
  undefined
);

export const useMetadata = () => {
  const metadata = useContext(MetadataContext);

  if (!metadata) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }

  return metadata;
};

export const MetadataProvider: FC<{
  metadata: Metadata;
  children: ReactNode;
}> = props => {
  const [metadata, setMetadata] = useOptimistic(props.metadata);

  return (
    <MetadataContext.Provider value={[metadata, setMetadata]}>
      {props.children}
    </MetadataContext.Provider>
  );
};
