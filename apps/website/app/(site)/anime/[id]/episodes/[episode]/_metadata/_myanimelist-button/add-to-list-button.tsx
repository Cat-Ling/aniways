'use client';

import { Button } from '@ui/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { addToListAction } from './myanimelist-actions';
import { toast } from '@aniways/ui/components/ui/sonner';
import { useAuth } from '@aniways/myanimelist';
import { LoginModal } from '@/app/login-modal';

type AddToListButtonProps = {
  malId: number;
};

export const AddToListButton = ({ malId }: AddToListButtonProps) => {
  const session = useAuth();
  const [loading, setLoading] = useState(false);

  if (!session.user) {
    return <LoginModal>Add To List</LoginModal>;
  }

  return (
    <Button
      onClick={async () => {
        setLoading(true);

        try {
          const { error, success } = await addToListAction(malId);

          if (error || !success) {
            throw new Error('Failed to add to list');
          }

          toast('Added to list', {
            description: 'Anime has been added to your list',
          });
        } catch (e) {
          const error =
            e instanceof Error ? e : new Error('Failed to add to list');

          toast('Failed to add to list', {
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
