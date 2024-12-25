import type { InferSelectModel } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { cuid2 } from "drizzle-cuid2/postgres";

export const seasonalAnime = pgTable("seasonal_anime", {
  id: cuid2("id").primaryKey().defaultRandom(),
  malId: integer("mal_id").notNull(),
  title: text().notNull(),
  rating: text(),
  type: text(),
  episodes: integer(),
  synopsis: text(),
  imageUrl: text("image_url").notNull(),
  order: integer().notNull(),
  status: text(),
});

export type SeasonalAnime = InferSelectModel<typeof seasonalAnime>;

export interface Settings {
  autoPlay: boolean;
  autoNext: boolean;
  autoUpdateMal: boolean;
  darkMode: boolean;
}

export const users = pgTable("users", {
  id: cuid2("id").primaryKey().defaultRandom(),
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
