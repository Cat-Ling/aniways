import { HiAnime } from "aniwatch";
import { z } from "zod";

const SYNC_URL = `https://raw.githubusercontent.com/bal-mackup/mal-backup/refs/heads/master/mal/anime`;

const SyncDataSchema = z.object({
  id: z.number(),
  aniId: z.number(),
  Sites: z.object({
    Zoro: z.record(
      z.object({
        identifier: z.string(),
        url: z.string().url(),
      }),
    ),
  }),
});

export class Mapper {
  async map(
    args:
      | {
          malId: number;
        }
      | {
          hiAnimeId: string;
        },
  ) {
    if ("malId" in args) {
      const response = await fetch(`${SYNC_URL}/${args.malId}.json`)
        .then((res) => res.json())
        .then((data) => SyncDataSchema.parse(data))
        .catch(() => null);

      const hiAnimeId = Object.values(response?.Sites.Zoro ?? {})[0]
        ?.url?.split("/")
        .pop();

      return {
        hiAnimeId: hiAnimeId ?? null,
        aniListId: response?.aniId ?? null,
        malId: args.malId ?? null,
      };
    }

    const scraper = new HiAnime.Scraper();

    return scraper.getInfo(args.hiAnimeId).then((data) => ({
      malId: data.anime.info.malId,
      hiAnimeId: args.hiAnimeId,
      aniListId: data.anime.info.anilistId,
    }));
  }
}
