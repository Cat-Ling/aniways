import { createId, db, schema } from '@aniways/database';

type AnimeWithVideo = schema.Anime & { videos: schema.Video[] };

const NOT_FOUND = 'not-found' as const;

export const seedMissingAnimeEpisodes = Object.assign(
  _seedMissingAnimeEpisodes,
  { error: NOT_FOUND }
);

async function _seedMissingAnimeEpisodes(anime: AnimeWithVideo) {
  if (anime.lastEpisode === null || anime.videos.length > 0) {
    return anime.videos;
  }

  const episodes = Array.from({
    length: Number(anime.lastEpisode),
  })
    .map((_, i) => Number(anime.lastEpisode) - i)
    .reverse();

  if (episodes.length === 0) throw NOT_FOUND;

  const result = await db
    .insert(schema.video)
    .values(
      episodes.map(ep => ({
        id: createId(),
        animeId: anime.id,
        episode: String(ep),
        slug: `${anime.slug}-episode-${ep}`,
        createdAt: new Date(),
      }))
    )
    .returning();

  if (result.length === 0) throw NOT_FOUND;

  return result.sort((a, b) => Number(a.episode) - Number(b.episode));
}
