import { Jikan4 } from "node-myanimelist";

export const getTrailerUrl = (malId: number) =>
  Jikan4.anime(malId)
    .info()
    .then(res => res.data.trailer.embed_url);
