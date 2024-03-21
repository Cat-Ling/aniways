'use client';

import { signOut } from '@aniways/myanimelist';
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

export const LogoutModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>Log Out</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
          <DialogDescription>
            You will be logged out of your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant={'secondary'}>Cancel</Button>
          </DialogClose>
          <Button onClick={signOut}>Log Out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
