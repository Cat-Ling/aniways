import { client, db } from "@/server/db";
import { mappings } from "@/server/db/schema";
import { HiAnime } from "aniwatch";
import { load } from "cheerio";
import { inArray } from "drizzle-orm";

const BASE_URL = `https://hianime.to`;
const AZ_URL = `${BASE_URL}/az-list`;

// eslint-disable-next-line @typescript-eslint/no-empty-function
console.error = () => {};

async function scrapeAZList(page = 1) {
  console.log(`Fetching page ${page}`);

  console.time(`Page ${page}`);
  const $ = await fetch(`${AZ_URL}?page=${page}`)
    .then((res) => res.text())
    .then(load);

  const ids = $(".flw-item .film-poster a")
    .map((_, el) => {
      const $el = $(el);
      const url = $el.attr("href");

      return url?.replace("/watch/", "");
    })
    .get();

  const inDb = await db
    .select()
    .from(mappings)
    .where(inArray(mappings.hiAnimeId, ids));

  const syncedData = await Promise.all(
    ids
      .filter((id) => {
        const isInDB = inDb.map((item) => item.hiAnimeId).includes(id);
        if (isInDB) {
          console.log(`Skipping ${id}`);
        }
        return !isInDB;
      })
      .map(async (id) => {
        console.log(`Getting info of ${id}`);
        let info = await new HiAnime.Scraper().getInfo(id).catch(() => null);

        while (!info) {
          await new Promise((res) => setTimeout(res, 200));
          console.log(`Retrying ${id}`);
          info = await new HiAnime.Scraper().getInfo(id).catch(() => null);
        }

        return {
          hiAnimeId: id,
          malId: info.anime.info.malId,
          anilistId: info.anime.info.anilistId,
        };
      }),
  );

  if (syncedData.length) {
    console.log(`Inserting ${syncedData.length} new mappings`);
    await db.insert(mappings).values(syncedData).onConflictDoNothing();
  }

  console.timeEnd(`Page ${page}`);

  const hasNextPage = !!$('.page-item a[title="Next"]').length;
  if (!hasNextPage) {
    await client.end();
    return;
  }

  return new Promise((res) => {
    setTimeout(() => {
      void scrapeAZList(page + 1).then(res);
    }, 200);
  });
}

console.time("Mapping function");
void scrapeAZList().finally(() => {
  console.timeEnd("Mapping function");
});
