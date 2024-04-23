import { RedirectType, notFound, redirect } from 'next/navigation';
import { createAnimeService, createEpisodeService } from '@aniways/data';

const AnimeDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const anime = await createAnimeService().getAnimeById(id, true);

  if (!anime) notFound();

  const { seedMissingEpisodes } = createEpisodeService();

  try {
    anime.videos = await seedMissingEpisodes(anime);
  } catch (e) {
    if (e === seedMissingEpisodes.error) notFound();
    throw e;
  }

  redirect(
    `/anime/${id}/episodes/${anime.videos.at(0)?.episode ?? 1}`,
    RedirectType.replace
  );
};

export default AnimeDetailsPage;
