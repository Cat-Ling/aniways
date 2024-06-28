"use client";

import { create } from "zustand";

import { AnimeSelectorForm } from "./forms/anime-selector-form";
import { AnimeUrlInputForm } from "./forms/anime-url-input-form";

interface AnimeChooserProps {
  query: string;
}

type Mode = "search" | "url";

// use zustand instead of react state because of Credenza's mounting/unmounting
const useMode = create<{
  mode: Mode;
  setMode: (mode: Mode) => void;
}>(set => ({
  mode: "search",
  setMode: mode => set({ mode }),
}));

export const AnimeChooser = ({ query }: AnimeChooserProps) => {
  const [mode, setMode] = useMode(state => [state.mode, state.setMode]);

  if (mode === "search") {
    return (
      <AnimeSelectorForm query={query} onChangeMode={() => setMode("url")} />
    );
  }

  return <AnimeUrlInputForm onChangeMode={() => setMode("search")} />;
};
