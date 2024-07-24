import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { LogIn } from "lucide-react";

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
  const routerState = useRouterState();

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>
          <LogIn className="mr-2 size-4" />
          {children ?? "Login"}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Login using your MyAnimeList account</CredenzaTitle>
          <CredenzaDescription>
            This will allow you to import your anime list from MyAnimeList as
            well as sync your progress.
            <p className="italic">NOTE: Manga list sync will be added soon.</p>
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter className="flex-col-reverse gap-2 md:flex-row">
          <CredenzaClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </CredenzaClose>
          <Button asChild>
            <a
              href={
                // eslint-disable-next-line turbo/no-undeclared-env-vars
                import.meta.env.DEV ?
                  `http://localhost:3000/auth/signin?redirect=${window.location.origin + routerState.location.href}`
                : `https://aniways.xyz/auth/signin?redirect=${window.location.origin + routerState.location.href}`
              }
            >
              Log in with MyAnimeList
            </a>
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
