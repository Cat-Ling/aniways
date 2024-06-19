'use client';

import { LoginModal } from '@/app/login-modal';
import { useAuth } from '@aniways/auth';
import { Button } from '@aniways/ui/components/ui/button';
import { toast } from '@aniways/ui/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMetadata } from '../metadata-provider';
import { addToListAction } from './myanimelist-actions';

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
