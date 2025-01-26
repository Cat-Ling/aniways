import { relations, type InferSelectModel } from "drizzle-orm";
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
  "mappings",
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

export const mappingRelations = relations(mappings, ({ one }) => ({
  anime: one(animes),
}));

export type Mappings = InferSelectModel<typeof mappings>;

export const animes = pgTable(
  "animes",
  {
    id: cuid2().primaryKey().defaultRandom(),
    mappingId: text()
      .notNull()
      .references(() => mappings.hiAnimeId),
    name: text().notNull(),
    jname: text().notNull(),
    description: text(),
    poster: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    lastEpisode: integer(),
  },
  (t) => [
    {
      mappingIdx: index("mapping_idx").on(t.mappingId),
    },
  ],
);

export const animeRelations = relations(animes, ({ one, many }) => ({
  mapping: one(mappings, {
    fields: [animes.mappingId],
    references: [mappings.hiAnimeId],
  }),
  episodes: many(episodes),
}));

export type Anime = InferSelectModel<typeof animes>;

export const episodes = pgTable(
  "episodes",
  {
    id: cuid2().primaryKey().defaultRandom(),
    animeId: text()
      .notNull()
      .references(() => animes.id),
    episode: integer().notNull(),
    videoUrl: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    {
      animeIdx: index("anime_idx").on(t.animeId),
    },
  ],
);

export const episodeRelations = relations(episodes, ({ one }) => ({
  anime: one(animes, {
    fields: [episodes.animeId],
    references: [animes.id],
  }),
}));

export type Episode = InferSelectModel<typeof episodes>;

export const seasonalAnimes = pgTable("seasonal_animes", {
  animeId: text().notNull().primaryKey(),
  title: text().notNull(),
  rating: text(),
  type: text(),
  episodes: integer(),
  synopsis: text(),
  bannerImage: text().notNull(),
  backUpImage: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SeasonalAnime = InferSelectModel<typeof seasonalAnimes>;

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
