import type { NextRequest } from "next/server";
import { notFound, redirect, RedirectType } from "next/navigation";

import { api } from "~/trpc/server";

export const GET = async (
  _req: NextRequest,
  props: {
    params: {
      id: string;
      episode: string;
    };
  }
) => {
  const episode = await api.episodes.getEpisodeByAnimeIdAndEpisode({
    animeId: props.params.id,
    episode: Number(props.params.episode),
  });

  if (!episode) notFound();

  const url = await api.episodes.getDownloadUrl({ episodeSlug: episode.slug });

  if (!url) notFound();

  redirect(url, RedirectType.replace);
};
