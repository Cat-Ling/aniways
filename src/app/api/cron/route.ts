import { env } from "@/env";
import { db } from "@/server/db";
import { mappings } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { inArray } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const cronKey = req.headers.get("X-Cron-Key");
  const mode = req.nextUrl.searchParams.get("mode");

  if (cronKey !== env.CRON_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  void (async () => {
    console.time("Cron Job");
    if (mode === "mappings" || !mode) await scrapeMappings();
    if (mode === "seasonal" || !mode) await scrapeSeasonalAnimes();
    console.timeEnd("Cron Job");
    console.log("Cron Job Finished");
  })().catch((err) => {
    console.error(err);
  });

  return NextResponse.json({
    message: "Cron Job Started",
  });
};

async function scrapeMappings() {
  let hasNextPage = true;
  let page = 1;

  let totalInserted = 0;

  while (hasNextPage) {
    const timeTag = `Page ${page}`;
    console.time(timeTag);

    const anime = await api.hiAnime.getAZList({ page });
    hasNextPage = anime.hasNextPage;
    if (hasNextPage) page++;

    const inDb = await db
      .select()
      .from(mappings)
      .where(inArray(mappings.hiAnimeId, anime.animes));

    const syncedData = await Promise.all(
      anime.animes
        .filter((id) => {
          const isInDB = inDb.map((item) => item.hiAnimeId).includes(id);
          if (isInDB) {
            console.log(`Skipping ${id}`);
          }
          return !isInDB;
        })
        .map(async (id) => {
          console.log(`Getting info of ${id}`);
          let info = await api.hiAnime.getSyncData({ id }).catch(() => null);

          while (!info) {
            await new Promise((res) => setTimeout(res, 200));
            console.log(`Retrying ${id}`);
            info = await api.hiAnime.getSyncData({ id }).catch(() => null);
          }

          return info;
        }),
    );

    if (syncedData.length) {
      console.log(`Inserting ${syncedData.length} new mappings`);
      totalInserted += syncedData.length;
      await db.insert(mappings).values(syncedData).onConflictDoNothing();
    }

    console.timeEnd(timeTag);

    await new Promise((res) => {
      setTimeout(res, 200);
    });
  }

  console.log(`Total inserted: ${totalInserted}`);
}

async function scrapeSeasonalAnimes() {
  await api.mal.saveSeasonalSpotlightAnime();
}
