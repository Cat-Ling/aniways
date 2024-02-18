import { RedirectType, notFound, redirect } from 'next/navigation';
import { createId, db, schema } from '@aniways/database';

const { video } = schema;

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

  if (anime.lastEpisode && anime.videos.length === 0) {
    const episodes = Array.from({
      length: Number(anime.lastEpisode),
    })
      .map((_, i) => Number(anime.lastEpisode) - i)
      .reverse();
    if (episodes.length === 0) notFound();
    const result = await db
      .insert(video)
      .values(
        episodes.map(ep => ({
          id: createId(),
          animeId: anime.id,
          episode: String(ep),
          slug: `${anime.slug}-episode-${ep}`,
          createdAt: new Date(),
        }))
      )
      .returning()
      .execute();
    if (result.length === 0) notFound();
    anime.videos = result.sort((a, b) => Number(a.episode) - Number(b.episode));
  }

  redirect(
    `/anime/${id}/episodes/${anime.videos.at(0)?.episode ?? 1}`,
    RedirectType.replace
  );
};

export default AnimeDetailsPage;
