export type RecentlyReleasedAnime = {
    name: string;
    episode: number;
    image: string;
};
export type Anime = RecentlyReleasedAnime & {
    malId: string;
    malUrl: string;
    titles: string[];
    type: AnimeType;
    score: number;
    scoredBy: number;
    description: string;
    genres: string[];
    ageRating: string;
    season: AnimeSeason | null;
    totalEpisodes: number | null;
    airedStart: string;
    airedEnd: string | null;
    status: AnimeStatus;
    duration: string;
};
export type AnimeSeason = 'summer' | 'spring' | 'fall' | 'winter';
export type AnimeStatus = 'Finished Airing' | 'Currently Airing' | 'Not yet aired';
export type AnimeType = 'tv' | 'movie' | 'special' | 'ova' | 'ona' | 'music';
//# sourceMappingURL=types.d.ts.map