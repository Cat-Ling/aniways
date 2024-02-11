import { RecentlyReleasedAnime } from '../../types';
export default function getRecentlyReleasedAnime(page: number): Promise<{
    anime: (RecentlyReleasedAnime & {
        url: string;
    })[];
    hasNext: boolean;
}>;
//# sourceMappingURL=index.d.ts.map