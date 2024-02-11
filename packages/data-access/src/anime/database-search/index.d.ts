export default function searchFromDB(query: string, page: number): Promise<{
    animes: {
        url: string;
        image: string;
        description: string;
        id: string;
        title: string;
        year: string;
        status: "FINISHED_AIRING" | "CURRENTLY_AIRING" | "NOT_YET_AIRED";
        slug: string;
        malAnimeId: string | null;
        genres: {
            id: string;
            animeId: string;
            genre: string;
        }[];
    }[];
    hasNext: boolean;
}>;
//# sourceMappingURL=index.d.ts.map