import { Play } from 'lucide-react';

type AnimeGridProps =
  | {
      type?: 'home';
      anime: {
        name: string;
        image: string;
        episode: number | string;
        url: string;
      }[];
    }
  | {
      type: 'search';
      anime: {
        title: string;
        image: string;
        url: string;
        episodes?: number | string | undefined;
      }[];
    };

export const AnimeGrid = (props: AnimeGridProps) => {
  return (
    <ul className="grid h-full grid-cols-1 gap-3 md:grid-cols-5">
      {props.type === 'home' ?
        props.anime.map(anime => {
          return <HomeAnimeItem {...anime} key={anime.name} />;
        })
      : props.type === 'search' ?
        props.anime.map(anime => {
          return <SearchAnimeItem {...anime} key={anime.title} />;
        })
      : null}
    </ul>
  );
};

const HomeAnimeItem = async ({
  name,
  image,
  episode,
  url,
}: {
  name: string;
  image: string;
  episode: number | string;
  url: string;
}) => {
  return (
    <li className="bg-background border-border group rounded-md border p-2">
      <a href={`${url}`} className="flex h-full flex-col gap-3">
        <div className="relative">
          <div
            className="aspect-[450/650] w-full rounded-md bg-cover"
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
          <div className="bg-muted/70 pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
            <Play className="text-primary h-8 w-8" />
            <p className="text-foreground mt-2 text-lg font-bold">Watch Now</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <p className="group-hover:text-primary line-clamp-2 text-sm transition">
            {name}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Episode {episode}
          </p>
        </div>
      </a>
    </li>
  );
};

const SearchAnimeItem = async ({
  title: name,
  image,
  url,
  episodes,
}: {
  title: string;
  image: string;
  url: string;
  episodes?: number | string | undefined;
}) => {
  return (
    <li className="bg-background border-border group rounded-md border p-2">
      <a href={`${url}`} className="flex h-full flex-col gap-3">
        <div className="relative">
          <div
            className="aspect-[450/650] w-full rounded-md bg-cover"
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
          <div className="bg-muted/70 pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
            <Play className="text-primary h-8 w-8" />
            <p className="text-foreground mt-2 text-lg font-bold">Watch Now</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <p className="group-hover:text-primary line-clamp-2 text-sm transition">
            {name}
          </p>
          {episodes && (
            <p className="text-muted-foreground mt-1 text-sm">
              {episodes} episodes
            </p>
          )}
        </div>
      </a>
    </li>
  );
};
