"use client";

import type { ReactNode } from "react";

import { signIn } from "@aniways/auth/react";
import { Button } from "@aniways/ui/button";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@aniways/ui/credenza";

interface LoginModalProps {
  children?: ReactNode;
}

export const LoginModal = ({ children }: LoginModalProps) => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>{children ?? "Login"}</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Login using your MyAnimeList account</CredenzaTitle>
          <CredenzaDescription>
            This will allow you to import your anime list from MyAnimeList as
            well as sync your progress.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter className="flex-col-reverse gap-2 md:flex-row">
          <CredenzaClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </CredenzaClose>
          <Button
            onClick={() => {
              signIn({ redirectUrl: window.location.href });
            }}
          >
            Log in with MyAnimeList
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
