'use client';

import { Button } from '@aniways/ui/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { addToListAction } from './myanimelist-actions';
import { toast } from '@aniways/ui/components/ui/sonner';
import { useAuth } from '@aniways/auth';
import { LoginModal } from '@/app/login-modal';
import { useParams } from 'next/navigation';
import { useMetadata } from '../metadata-provider';

type AddToListButtonProps = {
  malId: number;
};

export const AddToListButton = ({ malId }: AddToListButtonProps) => {
  const [, setMetadata] = useMetadata();
  const session = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  if (!session.user) {
    return <LoginModal>Add To List</LoginModal>;
  }

  return (
    <Button
      onClick={async () => {
        setLoading(true);

        try {
          const { error, details } = await addToListAction(
            malId,
            `/anime/${id}`
          );

          if (error || !details) {
            throw new Error('Failed to add to list');
          }

          setMetadata(details);

          toast.success('Added to list', {
            description: 'Anime has been added to your list',
          });
        } catch (e) {
          const error =
            e instanceof Error ? e : new Error('Failed to add to list');

          toast.error('Failed to add to list', {
            description: error.message,
          });
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
    >
      {loading ?
        <Loader2 className="animate-spin" />
      : 'Add to List'}
    </Button>
  );
};
