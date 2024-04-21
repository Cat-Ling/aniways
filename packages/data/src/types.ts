import { type schema } from '@aniways/database';

export namespace Schema {
  export type AnimeTitle = schema.AnimeTitle;
  export type AnimeTitleWithRelations = schema.AnimeTitleWithRelations;
  export type Anime = schema.Anime;
  export type AnimeWithRelations = schema.AnimeWithRelations;
  export type AnimeGenre = schema.AnimeGenre;
  export type AnimeGenreWithRelations = schema.AnimeGenreWithRelations;
  export type Video = schema.Video;
  export type VideoWithRelations = schema.VideoWithRelations;
}
