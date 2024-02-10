import parse from 'node-html-parser';
import { writeFile } from 'fs/promises';
import db from '.';
import { anime as AnimeTable, animeGenre } from './schema';
import { chunk } from 'lodash';
import { createId } from '@paralleldrive/cuid2';

const getAnimeFromGogoAnime = async (page: number) => {
  return fetch(`https://gogoanime3.co/anime-list.html?page=${page}`)
    .then(res => res.text())
    .then(html => {
      return parse(html)
        .querySelectorAll('.listing li')
        .map(li => {
          const element = li.getAttribute('title');
          if (!element) return;
          const dom = parse(`<div>${element}</div>`);
          const image = dom.querySelector('img')?.getAttribute('src');
          const name = dom.querySelector('.bigChar')?.innerText;
          const genres = dom
            .querySelectorAll('.type a')
            .map(a => a.getAttribute('title'));
          const released = dom
            .querySelectorAll('.type')
            .map(a =>
              a.innerText.includes('Released') ?
                a.innerText.replace('Released: ', '').trim()
              : null
            )
            .filter(year => year !== null)
            .at(0);
          const status = dom
            .querySelectorAll('.type')
            .map(a =>
              a.innerText.includes('Status') ?
                a.innerText.replace('Status: ', '').trim()
              : null
            )
            .filter(status => status !== null)
            .at(0);
          const description = dom
            .querySelector('.sumer')
            ?.innerText.replace('Plot Summary: ', '')
            .trim();
          const slug = li
            .querySelector('a')
            ?.getAttribute('href')
            ?.split('/')
            .at(-1);
          return {
            name,
            image,
            genres,
            released,
            status,
            description,
            slug,
          };
        });
    });
};

async function main() {
  await db.delete(AnimeTable).execute();
  await db.delete(animeGenre).execute();
  console.log('Deleted all anime');

  let page = 1;

  let anime: Awaited<ReturnType<typeof getAnimeFromGogoAnime>> = [];

  while (true) {
    console.log(`Fetching page ${page}`);
    const animeList = await getAnimeFromGogoAnime(page);
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
