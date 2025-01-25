CREATE TABLE "mapping" (
	"hiAnimeId" text PRIMARY KEY NOT NULL,
	"malId" integer,
	"anilistId" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seasonal_animes" (
	"animeId" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"rating" text,
	"type" text,
	"episodes" integer,
	"synopsis" text,
	"bannerImage" text NOT NULL,
	"backUpImage" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"mal_id" integer NOT NULL,
	"username" text NOT NULL,
	"picture" text,
	"gender" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"settings" jsonb DEFAULT '{"autoPlay":true,"autoNext":true,"autoUpdateMal":false,"darkMode":true}'::jsonb,
	CONSTRAINT "users_mal_id_unique" UNIQUE("mal_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
