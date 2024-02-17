import { RedirectType, notFound, redirect } from 'next/navigation';
import { db } from '@aniways/data-access';

const AnimeDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const anime = await db.query.anime.findFirst({
    where: (fields, actions) => actions.eq(fields.id, id),
    with: {
      videos: {
        orderBy: (fields, actions) => actions.asc(fields.episode),
        limit: 1,
      },
    },
  });

  if (!anime) notFound();

  redirect(
    `/anime/${id}/episodes/${anime.videos[0].episode}`,
    RedirectType.replace
  );
};

export default AnimeDetailsPage;
