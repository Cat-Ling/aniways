CREATE TABLE "animes" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"mappingId" text NOT NULL,
	"name" text NOT NULL,
	"jname" text NOT NULL,
	"description" text,
	"poster" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"lastEpisode" integer
);
--> statement-breakpoint
CREATE TABLE "episodes" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"animeId" text NOT NULL,
	"episode" integer NOT NULL,
	"videoUrl" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mapping" RENAME TO "mappings";--> statement-breakpoint
ALTER TABLE "animes" ADD CONSTRAINT "animes_mappingId_mappings_hiAnimeId_fk" FOREIGN KEY ("mappingId") REFERENCES "public"."mappings"("hiAnimeId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_animeId_animes_id_fk" FOREIGN KEY ("animeId") REFERENCES "public"."animes"("id") ON DELETE no action ON UPDATE no action;