import { InferSelectModel, relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';

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
    image: text('image').notNull(),
    slug: text('slug').notNull(),
    lastEpisode: numeric('last_episode'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    malAnimeId: integer('mal_anime_id'),
  },
  table => ({
    malAnimeIdx: index('anime_mal_anime_idx').on(table.malAnimeId),
    slugIdx: index('anime_slug_idx').on(table.slug),
    updatedAtIdx: index('anime_updated_at_idx').on(table.updatedAt),
  })
);

export type Anime = InferSelectModel<typeof anime>;

export const animeRelations = relations(anime, ({ many }) => ({
  videos: many(video, {
    relationName: 'anime-videos',
  }),
}));

export type AnimeWithRelations = Anime & {
  videos: Video[];
};

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
    videoUrl: text('video_url'),
  },
  table => ({
    animeIdx: index('video_anime_idx').on(table.animeId),
    episodeIdx: index('video_episode_idx').on(table.episode),
    slugIdx: index('video_slug_idx').on(table.slug),
    createdAtIdx: index('video_created_at_idx').on(table.createdAt),
  })
);

export type Video = InferSelectModel<typeof video>;

export const videoRelations = relations(video, ({ one }) => ({
  anime: one(anime, {
    relationName: 'anime-videos',
    fields: [video.animeId],
    references: [anime.id],
  }),
}));

export type VideoWithRelations = Video & {
  anime: Anime;
};
