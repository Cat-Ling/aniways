import {
	getAnimeById,
	getContinueWatchingAnime,
	getRecentlyReleasedAnime,
	searchAnimeFromDB,
} from "./functions";

export class AnimeService {
	getAnimeById = getAnimeById;
	getContinueWatchingAnimes = getContinueWatchingAnime;
	getRecentlyReleasedAnimes = getRecentlyReleasedAnime;
	searchAnime = searchAnimeFromDB;
}

export const createAnimeService = () => new AnimeService();
