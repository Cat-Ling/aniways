import { z } from "zod";
import { type schema } from "../../server/db";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { mappings } from "../../server/db/schema";
import { eq, inArray } from "drizzle-orm";
import { type HiAnimeScraper } from "../hianime";

const SYNC_URL = `https://raw.githubusercontent.com/bal-mackup/mal-backup/refs/heads/master/mal/anime`;

const SyncDataSchema = z.object({
  id: z.number().nullable(),
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
  private db: PostgresJsDatabase<typeof schema>;
  private hiAnimeScraper: HiAnimeScraper;

  constructor(
    db: PostgresJsDatabase<typeof schema>,
    hiAnimeScraper: HiAnimeScraper,
  ) {
    this.db = db;
    this.hiAnimeScraper = hiAnimeScraper;
  }

  async map(args: { malId: number } | { hiAnimeId: string }) {
    if ("malId" in args) {
      const mapping = await this.db
        .select()
        .from(mappings)
        .where(eq(mappings.malId, args.malId))
        .then((rows) => rows[0]);

      if (mapping) {
        return {
          type: "malId" as const,
          malId: args.malId,
          hiAnimeId: mapping.hiAnimeId,
          anilistId: mapping.anilistId,
        };
      }

      const response = await fetch(`${SYNC_URL}/${args.malId}.json`, {
        cache: "force-cache",
      })
        .then((res) => res.json())
        .then((data) => SyncDataSchema.parse(data))
        .then((data) => {
          const hiAnimeId =
            Object.values(data?.Sites.Zoro ?? {})[0]
              ?.url?.split("/")
              .pop() ?? null;

          return {
            hiAnimeId,
            anilistId: data.aniId,
            malId: data.id,
          };
        })
        .catch(() => null);

      return {
        type: "malId" as const,
        malId: args.malId,
        hiAnimeId: response?.hiAnimeId ?? null,
        anilistId: response?.anilistId ?? null,
      };
    }

    const mapping = await this.db
      .select()
      .from(mappings)
      .where(eq(mappings.hiAnimeId, args.hiAnimeId))
      .then((rows) => rows[0]);

    if (mapping) {
      return {
        type: "hiAnimeId" as const,
        hiAnimeId: args.hiAnimeId,
        malId: mapping.malId,
        anilistId: mapping.anilistId,
      };
    }

    const syncData = await this.hiAnimeScraper.getSyncData(args.hiAnimeId);

    return {
      type: "hiAnimeId" as const,
      hiAnimeId: args.hiAnimeId,
      malId: syncData.malId,
      anilistId: syncData.anilistId,
    };
  }

  async mapAll(args: { malId: number[] } | { hiAnimeId: string[] }) {
    if ("malId" in args) {
      const mapping = await this.db
        .select()
        .from(mappings)
        .where(inArray(mappings.malId, args.malId));

      return await Promise.all(
        args.malId.map(async (malId) => {
          const map = mapping.find((m) => m.malId === malId);

          if (!map) {
            const response = await fetch(`${SYNC_URL}/${malId}.json`, {
              cache: "force-cache",
            })
              .then((res) => res.json())
              .then((data) => SyncDataSchema.parse(data))
              .then((data) => {
                const hiAnimeId =
                  Object.values(data?.Sites.Zoro ?? {})[0]
                    ?.url?.split("/")
                    .pop() ?? null;

                return {
                  hiAnimeId,
                  anilistId: data.aniId,
                  malId: data.id,
                };
              })
              .catch(() => null);

            if (response) {
              await this.db
                .insert(mappings)
                .values({
                  hiAnimeId: response.hiAnimeId ?? "",
                  anilistId: response.anilistId,
                  malId: response.malId,
                })
                .onConflictDoUpdate({
                  target: mappings.hiAnimeId,
                  set: {
                    anilistId: response.anilistId,
                    malId: response.malId,
                  },
                });
            }

            return {
              type: "malId" as const,
              malId,
              hiAnimeId: response?.hiAnimeId ?? null,
              anilistId: response?.anilistId ?? null,
            };
          }

          return {
            type: "malId" as const,
            malId,
            hiAnimeId: map?.hiAnimeId ?? null,
            anilistId: map?.anilistId ?? null,
          };
        }),
      );
    }

    const mapping = await this.db
      .select()
      .from(mappings)
      .where(inArray(mappings.hiAnimeId, args.hiAnimeId));

    return args.hiAnimeId.map((hiAnimeId) => {
      const map = mapping.find((m) => m.hiAnimeId === hiAnimeId);

      return {
        type: "hiAnimeId" as const,
        hiAnimeId,
        malId: map?.malId ?? null,
        anilistId: map?.anilistId ?? null,
      };
    });
  }

  async hasInDB(args: { malId: number } | { hiAnimeId: string }) {
    if ("malId" in args) {
      return await this.db
        .select()
        .from(mappings)
        .where(eq(mappings.malId, args.malId))
        .then((rows) => rows.length > 0);
    }

    return await this.db
      .select()
      .from(mappings)
      .where(eq(mappings.hiAnimeId, args.hiAnimeId))
      .then((rows) => rows.length > 0);
  }

  async addMapping(args: {
    hiAnimeId: string;
    malId: number | null;
    anilistId: number | null;
  }) {
    await this.db
      .insert(mappings)
      .values({
        malId: args.malId,
        hiAnimeId: args.hiAnimeId,
        anilistId: args.anilistId,
      })
      .onConflictDoUpdate({
        target: mappings.hiAnimeId,
        set: {
          malId: args.malId,
          anilistId: args.anilistId,
        },
      });
  }
}
