import { notFound, redirect, RedirectType } from "next/navigation";

import { createAnimeService } from "@aniways/data";

const AnimeDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { getAnimeById } = createAnimeService();

  const anime = await getAnimeById(id);

  if (!anime) notFound();

  redirect(
    `/anime/${id}/episodes/${anime.firstEpisode ?? 1}`,
    RedirectType.replace,
  );
};

export default AnimeDetailsPage;
