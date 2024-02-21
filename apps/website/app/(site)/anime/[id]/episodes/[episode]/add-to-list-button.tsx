'use client';

import { Button } from '@ui/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { addToListAction } from './add-to-list-action';
import { toast } from '@aniways/ui/components/ui/sonner';
import { useSession } from '@animelist/auth-next/client';
import { LoginModal } from '../../../../../login-modal';

type AddToListButtonProps = {
  malId: number;
};

export const AddToListButton = ({ malId }: AddToListButtonProps) => {
  const session = useSession();
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
