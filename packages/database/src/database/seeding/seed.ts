import { scrapeAllAnime } from '@aniways/web-scraping';
import { createId } from '@paralleldrive/cuid2';
import { writeFile } from 'fs/promises';
import { chunk } from 'lodash';
import { db, schema } from '..';

const { anime: AnimeTable, animeGenre } = schema;

async function main() {
  await db.delete(AnimeTable).execute();
  await db.delete(animeGenre).execute();
  console.log('Deleted all anime');

  let page = 1;

  let anime: Awaited<ReturnType<typeof scrapeAllAnime>> = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log(`Fetching page ${page}`);
    const animeList = await scrapeAllAnime(page);
    if (animeList.length === 0) break;
    anime = [...anime, ...animeList];
    page++;
  }

  await writeFile('anime.json', JSON.stringify(anime, null, 2), {
    flag: 'w',
  });

  const insertValues = anime
    .filter(
      anime =>
        anime &&
        anime.name &&
        anime.description &&
        anime.image &&
        anime.released &&
        anime.genres &&
        anime.genres.length &&
        anime.slug
    )
    .map(anime => ({
      id: createId(),
      title: anime!.name!,
      description: anime!.description!,
      image: anime!.image!,
      year: anime!.released!,
      status:
        ({
          Upcoming: 'NOT_YET_AIRED',
          Ongoing: 'CURRENTLY_AIRING',
          Completed: 'FINISHED_AIRING',
        }[anime!.status! as 'Upcoming' | 'Ongoing' | 'Completed']! as any) ??
        'NOT_YET_AIRED',
      slug: anime!.slug!,
    }));

  console.log(`Inserting ${insertValues.length} anime`);

  let insertIds: { id: string }[] = [];

  await Promise.all(
    chunk(insertValues, 1000).map(async chunk => {
      insertIds = [
        ...insertIds,
        ...(await db.insert(AnimeTable).values(chunk).returning().execute()),
      ];
    })
  );

  console.log(`Inserting genres`);

  await Promise.all(
    insertIds.map(async ({ id }, index) => {
      const animeGenres = anime[index]!.genres!.map(genre => ({
        id: createId(),
        animeId: id,
        genre: genre!,
      }));
      if (animeGenres.length === 0) return;
      return await db.insert(animeGenre).values(animeGenres).execute();
    })
  );
}

export const seed = main;
