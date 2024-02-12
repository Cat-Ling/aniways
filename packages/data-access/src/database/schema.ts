import {
  AnyPgColumn,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
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

export const anime = pgTable(
  'anime',
  {
    id: varchar('id', { length: 25 }).primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    image: text('image').notNull(),
    year: numeric('year').notNull(),
    status: AnimeStatus('status').notNull(),
    slug: text('slug').notNull(),
    lastEpisode: numeric('last_episode'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    malAnimeId: varchar('mal_anime_id', { length: 25 }).references(
      (): AnyPgColumn => malAnime.id
    ),
  },
  table => ({
    malAnimeIdx: index('anime_mal_anime_idx').on(table.malAnimeId),
    slugIdx: index('anime_slug_idx').on(table.slug),
  })
);

export const animeRelations = relations(anime, ({ many, one }) => ({
  genres: many(animeGenre, {
    relationName: 'anime-genres',
  }),
  videos: many(video, {
    relationName: 'anime-videos',
  }),
  malAnime: one(malAnime, {
    relationName: 'mal-anime',
    fields: [anime.malAnimeId],
    references: [malAnime.id],
  }),
}));

export const malAnime = pgTable(
  'mal_anime',
  {
    id: varchar('id', { length: 25 }).primaryKey(),
    malId: numeric('mal_id').notNull(),
    year: numeric('year').notNull(),
    season: AnimeSeason('season').notNull(),
    type: AnimeType('type').notNull(),
    status: AnimeStatus('status').notNull(),
    totalEpisodes: numeric('total_episodes').notNull(),
    duration: text('duration').notNull(),
    ageRating: AnimeAgeRating('age_rating').notNull(),
    malUrl: text('mal_url').notNull(),
    titles: text('titles').notNull(),
    score: numeric('score').notNull(),
    scoredBy: numeric('scored_by').notNull(),
    airedStart: text('aired_start').notNull(),
    airedEnd: text('aired_end'),
    animeId: varchar('anime_id', { length: 25 })
      .notNull()
      .references((): AnyPgColumn => anime.id),
  },
  table => ({
    animeIdx: index('mal_anime_anime_idx').on(table.animeId),
  })
);

export const malAnimeRelations = relations(malAnime, ({ one }) => ({
  anime: one(anime, {
    relationName: 'mal-anime',
    fields: [malAnime.animeId],
    references: [anime.id],
  }),
}));

export const animeGenre = pgTable('anime_genre', {
  id: varchar('id', { length: 25 }).primaryKey(),
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

export const video = pgTable(
  'video',
  {
    id: varchar('id', { length: 25 }).primaryKey(),
    animeId: varchar('anime_id', { length: 25 })
      .notNull()
      .references((): AnyPgColumn => anime.id),
    episode: numeric('episode').notNull(),
    slug: text('slug').notNull(),
    title: text('title'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  table => ({
    animeIdx: index('video_anime_idx').on(table.animeId),
  })
);

export const videoRelations = relations(video, ({ one }) => ({
  anime: one(anime, {
    relationName: 'anime-videos',
    fields: [video.animeId],
    references: [anime.id],
  }),
}));
