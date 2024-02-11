import searchAnimeFromAnitaku from './anitaku';
export default function searchAnime(query: string, page: number): Promise<{
    animes: Awaited<ReturnType<typeof searchAnimeFromAnitaku>>;
    hasNext: boolean;
}>;
//# sourceMappingURL=index.d.ts.map