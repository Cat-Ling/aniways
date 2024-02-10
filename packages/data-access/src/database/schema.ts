import {
  AnyPgColumn,
  numeric,
  pgEnum,
  pgTable,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

export const AnimeSeason = pgEnum('anime_season', [
  'WINTER',
  'SPRING',
  'SUMMER',
  'FALL',
]);

export const AnimeType = pgEnum('anime_type', [
  'TV',
  'MOVIE',
  'SPECIAL',
  'OVA',
  'ONA',
  'MUSIC',
]);

export const AnimeStatus = pgEnum('anime_status', [
  'FINISHED_AIRING',
  'CURRENTLY_AIRING',
  'NOT_YET_AIRED',
]);

export const AnimeAgeRating = pgEnum('anime_rating', [
  'G',
  'PG',
  'PG_13',
  'R',
  'R_PLUS',
  'RX',
]);

export const anime = pgTable('anime', {
  id: varchar('id', { length: 25 }).primaryKey().default(createId()),
  title: text('title').notNull(),
  titleEnglish: text('title_english').notNull(),
  titleJapanese: text('title_japanese').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  season: AnimeSeason('season').notNull(),
  year: numeric('year').notNull(),
  malId: numeric('mal_id').notNull(),
  type: AnimeType('type').notNull(),
  totalEpisodes: numeric('total_episodes').notNull(),
  duration: text('duration').notNull(),
  ageRating: AnimeAgeRating('age_rating').notNull(),
  status: AnimeStatus('status').notNull(),
});

export const animeRelations = relations(anime, ({ many }) => ({
  genres: many(animeGenre, {
    relationName: 'anime-genres',
  }),
  videos: many(video, {
    relationName: 'anime-videos',
  }),
}));

export const animeGenre = pgTable('anime_genre', {
  id: varchar('id', { length: 25 }).primaryKey().default(createId()),
  animeId: varchar('anime_id', { length: 25 })
    .notNull()
    .references((): AnyPgColumn => anime.id),
  genre: text('genre').notNull(),
});

export const genreRelations = relations(animeGenre, ({ one }) => ({
  anime: one(anime, {
    relationName: 'anime-genres',
    fields: [animeGenre.id],
    references: [anime.id],
  }),
}));

export const video = pgTable('video', {
  id: varchar('id', { length: 25 }).primaryKey().default(createId()),
  animeId: varchar('anime_id', { length: 25 })
    .notNull()
    .references((): AnyPgColumn => anime.id),
  title: text('title'),
  url: text('url').notNull(),
  episode: numeric('episode').notNull(),
  image: text('image'),
});

export const videoRelations = relations(video, ({ one }) => ({
  anime: one(anime, {
    relationName: 'anime-videos',
    fields: [video.animeId],
    references: [anime.id],
  }),
}));
