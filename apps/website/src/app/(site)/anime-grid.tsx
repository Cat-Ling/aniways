import { Play } from 'lucide-react';

type AnimeGridProps = {
  anime: {
    name: string;
    image: string;
    episode: string;
    url: string;
    type: string;
  }[];
};

export const AnimeGrid = ({ anime }: AnimeGridProps) => {
  return (
    <ul className="grid h-full grid-cols-6 gap-3">
      {anime.map(({ name, image, episode, url, type }, i) => (
        <li
          key={i}
          className="bg-background border-border group rounded-md border p-2"
        >
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
                <p className="text-foreground mt-2 text-lg font-bold">
                  Watch Now
                </p>
              </div>
              <div className="bg-primary absolute bottom-0 left-0 rounded-bl-md rounded-tr-md p-1 text-sm">
                {type}
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
      ))}
    </ul>
  );
};
