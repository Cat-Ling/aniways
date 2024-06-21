import type { schema } from "@aniways/db";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Schema {
  export type Anime = schema.Anime;
  export type AnimeWithRelations = schema.AnimeWithRelations;
  export type Video = schema.Video;
  export type VideoWithRelations = schema.VideoWithRelations;
}
