"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { api } from "@/trpc/react";

export const ThemeSetter = () => {
  const settings = api.settings.getSettings.useQuery(undefined, {
    retry: false,
  });
  const { setTheme } = useTheme();

  useEffect(() => {
    if (settings.isLoading) return;

    let theme: string;

    if (typeof settings.data?.darkMode !== "boolean") {
      theme = "system";
    } else {
      theme = settings.data.darkMode ? "dark" : "light";
    }

    setTheme(theme);
  }, [settings, setTheme]);

  return <></>;
};
