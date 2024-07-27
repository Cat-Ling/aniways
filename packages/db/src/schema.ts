import type { InferSelectModel } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const AnimeSeason = pgEnum("anime_season", [
  "WINTER",
  "SPRING",
  "SUMMER",
  "FALL",
]);

export const AnimeType = pgEnum("anime_type", [
  "TV",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
]);

export const AnimeStatus = pgEnum("anime_status", [
  "FINISHED_AIRING",
  "CURRENTLY_AIRING",
  "NOT_YET_AIRED",
]);

export const AnimeAgeRating = pgEnum("anime_rating", [
  "G",
  "PG",
  "PG_13",
  "R",
  "R_PLUS",
  "RX",
]);

export const anime = pgTable(
  "anime",
  {
    id: varchar("id", { length: 25 }).primaryKey(),
    title: text("title").notNull(),
    image: text("image").notNull(),
    slug: text("slug").notNull(),
    lastEpisode: numeric("last_episode"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    malAnimeId: integer("mal_anime_id"),
  },
  table => ({
    malAnimeIdx: index("anime_mal_anime_idx").on(table.malAnimeId),
    slugIdx: index("anime_slug_idx").on(table.slug),
    updatedAtIdx: index("anime_updated_at_idx").on(table.updatedAt),
  })
);

export type Anime = InferSelectModel<typeof anime>;

export const animeRelations = relations(anime, ({ many }) => ({
  videos: many(video, {
    relationName: "anime-videos",
  }),
}));

export type AnimeWithRelations = Anime & {
  videos: Video[];
};

export const video = pgTable(
  "video",
  {
    id: varchar("id", { length: 25 }).primaryKey(),
    animeId: varchar("anime_id", { length: 25 })
      .notNull()
      .references((): AnyPgColumn => anime.id, { onDelete: "cascade" }),
    episode: numeric("episode").notNull(),
    slug: text("slug").notNull(),
    title: text("title"),
    createdAt: timestamp("created_at").defaultNow(),
    videoUrl: text("video_url"),
    streamingSources: jsonb("streaming_sources"),
  },
  table => ({
    animeIdx: index("video_anime_idx").on(table.animeId),
    episodeIdx: index("video_episode_idx").on(table.episode),
    slugIdx: index("video_slug_idx").on(table.slug),
    createdAtIdx: index("video_created_at_idx").on(table.createdAt),
  })
);

export type Video = InferSelectModel<typeof video>;

export const videoRelations = relations(video, ({ one }) => ({
  anime: one(anime, {
    relationName: "anime-videos",
    fields: [video.animeId],
    references: [anime.id],
  }),
}));

export type VideoWithRelations = Video & {
  anime: Anime;
};

export const seasonalAnime = pgTable("seasonal_anime", {
  id: varchar("id", { length: 25 }).primaryKey(),
  malId: integer("mal_id").notNull(),
  title: text("title").notNull(),
  rating: text("rating"),
  type: text("type"),
  episodes: integer("episodes"),
  synopsis: text("synopsis"),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull(),
  status: text("status"),
});

export type SeasonalAnime = InferSelectModel<typeof seasonalAnime>;

export interface Settings {
  autoPlay: boolean;
  autoNext: boolean;
  autoUpdateMal: boolean;
  darkMode: boolean;
}

export const users = pgTable("users", {
  id: varchar("id", { length: 25 }).primaryKey(),
  malId: integer("mal_id").notNull().unique(),
  username: text("username").notNull().unique(),
  picture: text("picture"),
  gender: text("gender"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  settings: jsonb("settings").$type<Settings>().default({
    autoPlay: true,
    autoNext: true,
    autoUpdateMal: false,
    darkMode: true,
  }),
});

export type User = InferSelectModel<typeof users>;

export const userRelations = relations(users, ({ many }) => ({
  library: many(library),
}));

interface MangaData {
  title: string;
  image: string;
}

export const library = pgTable("library", {
  id: varchar("id", { length: 25 }).primaryKey(),
  userId: varchar("user_id", { length: 25 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mangaId: text("manga_id").notNull(),
  mangaData: jsonb("manga_data").notNull().$type<MangaData>(),
  chapter: numeric("chapter").notNull(),
  page: numeric("page").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type Library = InferSelectModel<typeof library>;

export const LibraryRelations = relations(library, ({ one }) => ({
  user: one(users, {
    fields: [library.userId],
    references: [users.id],
  }),
}));
