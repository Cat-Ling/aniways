import { cache } from "react";

import { api } from "~/trpc/server";

export const getAnimeById = cache(api.anime.byId);

export const getEpisodesOfAnime = cache(api.episodes.getEpisodesOfAnime);
