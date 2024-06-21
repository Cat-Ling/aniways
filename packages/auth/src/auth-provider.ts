"use client";

export {
  SessionProvider as AuthProvider,
  useSession as useAuth,
} from "@animelist/auth-next/client";

export type { SessionProviderProps as AuthProviderProps } from "@animelist/auth-next/client";
