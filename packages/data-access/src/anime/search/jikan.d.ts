export default function searchAnimeFromJikan(query: string, page: number): Promise<{
    animes: {
        name: string;
        url: string;
        image: string;
        episodes: number;
    }[];
    hasNext: boolean;
}>;
//# sourceMappingURL=jikan.d.ts.map