import { useCallback, useEffect } from "react";

import { useAuth } from "@aniways/auth/react";

export const useDefaultLocalSettings = () => {
  const auth = useAuth();

  const setDefault = useCallback((key: string, value: string) => {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, value);
  }, []);

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.user) {
      setDefault("autoPlay", "true");
      setDefault("autoNext", "true");
    }

    if (auth.user) {
      localStorage.removeItem("autoPlay");
      localStorage.removeItem("autoNext");
    }

    setDefault("streamSource", "Main");
  }, [auth, setDefault]);
};
