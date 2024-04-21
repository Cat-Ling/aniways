import { RedirectType, notFound, redirect } from 'next/navigation';
import {
  getAnimeByIdWithVideos,
  seedMissingAnimeEpisodes,
} from '@aniways/data';

const AnimeDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const anime = await getAnimeByIdWithVideos(id);

  if (!anime) notFound();

  try {
    anime.videos = await seedMissingAnimeEpisodes(anime);
  } catch (e) {
    if (e === seedMissingAnimeEpisodes.error) notFound();
    throw e;
  }

  redirect(
    `/anime/${id}/episodes/${anime.videos.at(0)?.episode ?? 1}`,
    RedirectType.replace
  );
};

export default AnimeDetailsPage;
