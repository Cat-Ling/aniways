'use client';

import { signIn } from '@aniways/auth';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@aniways/ui/components/ui/dialog';
import { Button } from '@ui/components/ui/button';
import { ReactNode } from 'react';

type LoginModalProps = {
  children?: ReactNode;
};

export const LoginModal = ({ children }: LoginModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{children ?? 'Login'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login using your MyAnimeList account</DialogTitle>
          <DialogDescription>
            This will allow you to import your anime list from MyAnimeList as
            well as sync your progress.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant={'secondary'}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              signIn({ redirectUrl: window.location.href });
            }}
          >
            Log in with MyAnimeList
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
