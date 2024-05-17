import { db, orm, schema } from '@aniways/database';
import { searchAnimeFromMyAnimeList } from '@aniways/myanimelist';

async function getAllTitles(title: string) {
  const malAnimes = await searchAnimeFromMyAnimeList(title, 1, 20);

  if (
    malAnimes.pagination.has_next_page &&
    malAnimes.pagination.last_visible_page
  ) {
    for (let i = 2; i <= malAnimes.pagination.last_visible_page; i++) {
      const page = await searchAnimeFromMyAnimeList(title, i, 20);
      malAnimes.data.push(...page.data);
    }
  }

  const titles = malAnimes.data
    .flatMap(anime => [
      anime.title,
      anime.title_english,
      ...anime.title_synonyms,
    ])
    .filter(title => title) as string[];

  return titles;
}

export async function searchAnimeFromDB(query: string, page: number) {
  const titles = await getAllTitles(query);

  const animes = await db
    .select()
    .from(schema.anime)
    .where(
      orm.and(
        orm.notLike(schema.anime.title, '%Dub%'),
        orm.notLike(schema.anime.title, '%dub%'),
        orm.isNotNull(schema.anime.lastEpisode),
        orm.or(
          // orm.inArray(schema.anime.title, titles)
          // orm.sql`SIMILARITY(${schema.anime.title}, ${query}) > 0.2`,
          ...titles.map(
            title => orm.sql`SIMILARITY(${schema.anime.title}, ${title}) > 0.8`
          )
        )
      )
    )
    // .orderBy(
    //   // orm.sql`SIMILARITY(${schema.anime.title}, ${query}) DESC`,
    //   orm.sql`
    //     MAX(
    //       ARRAY[${titles.map(
    //         title => orm.sql`SIMILARITY(${schema.anime.title}, ${title})`
    //       )}]
    //     ) DESC
    //   `
    // )
    // .groupBy(schema.anime.id)
    .limit(21)
    .offset((page - 1) * 20);

  const hasNext = animes.length > 20;

  if (hasNext) {
    animes.pop();
  }

  return {
    animes,
    hasNext,
  };
}
