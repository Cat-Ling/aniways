import type { InferSelectModel } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { cuid2 } from "drizzle-cuid2/postgres";

export const mappings = pgTable(
  "mapping",
  {
    hiAnimeId: text().primaryKey(),
    malId: integer(),
    anilistId: integer(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    {
      malIdx: index("mal_idx").on(t.malId),
      anilistIdx: index("anilist_idx").on(t.anilistId),
    },
  ],
);

export type Mappings = InferSelectModel<typeof mappings>;

export interface Settings {
  autoPlay: boolean;
  autoNext: boolean;
  autoUpdateMal: boolean;
  darkMode: boolean;
}

export const users = pgTable("users", {
  id: cuid2().primaryKey().defaultRandom(),
  malId: integer("mal_id").notNull().unique(),
  username: text().notNull().unique(),
  picture: text(),
  gender: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  settings: jsonb().$type<Settings>().default({
    autoPlay: true,
    autoNext: true,
    autoUpdateMal: false,
    darkMode: true,
  }),
});

export type User = InferSelectModel<typeof users>;
