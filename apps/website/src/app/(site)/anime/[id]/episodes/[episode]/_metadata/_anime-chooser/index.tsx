"use client";

import { useState } from "react";

import { AnimeSelectorForm } from "./forms/anime-selector-form";
import { AnimeUrlInputForm } from "./forms/anime-url-input-form";

interface AnimeChooserProps {
  query: string;
}

type Mode = "search" | "url";

export const AnimeChooser = ({ query }: AnimeChooserProps) => {
  const [mode, setMode] = useState<Mode>("search");

  if (mode === "search") {
    return (
      <AnimeSelectorForm query={query} onChangeMode={() => setMode("url")} />
    );
  }

  return <AnimeUrlInputForm onChangeMode={() => setMode("search")} />;
};
