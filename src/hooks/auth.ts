"use client";

import { useSession } from "@animelist/auth-next/client";

type AuthFunction = (options: { redirectUrl?: string }) => void;

export const useAuth = () => {
  const session = useSession();

  const signIn: AuthFunction = ({ redirectUrl }) => {
    window.location.href = `/api/myanimelist/auth/sign-in${redirectUrl ? `?redirectUrl=${redirectUrl}` : ""}`;
  };

  const signOut: AuthFunction = ({ redirectUrl }) => {
    window.location.href = `/api/myanimelist/auth/sign-out${redirectUrl ? `?redirectUrl=${redirectUrl}` : ""}`;
  };

  return {
    session,
    signIn,
    signOut,
  };
};
