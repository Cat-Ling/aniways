"use client";

import type { ReactNode } from "react";
import { LogIn } from "lucide-react";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../ui/credenza";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/auth";

interface LoginModalProps {
  children?: ReactNode;
  mobile?: boolean;
}

export const LoginModal = ({ children, mobile }: LoginModalProps) => {
  const { signIn } = useAuth();

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button
          variant={mobile ? "navlink" : "default"}
          className={cn({
            "h-fit w-full justify-start": mobile,
          })}
        >
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
