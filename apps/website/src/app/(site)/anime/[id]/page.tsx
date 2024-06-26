import { notFound, redirect, RedirectType } from "next/navigation";

import { api } from "~/trpc/server";

const AnimeDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const firstEpisode = await api.episodes.getFirstEpisodeByAnimeId({ id });

  if (!firstEpisode.episode) notFound();

  redirect(
    `/anime/${id}/episodes/${firstEpisode.episode}`,
    RedirectType.replace,
  );
};

export default AnimeDetailsPage;
