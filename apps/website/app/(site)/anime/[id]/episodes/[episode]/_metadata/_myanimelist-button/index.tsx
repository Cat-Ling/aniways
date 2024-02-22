import { AddToListButton } from './add-to-list-button';
import { UpdateAnimeButton } from './update-anime-button';

type MyAnimeListButtonProps = {
  details: {
    mal_id: number;
    title: string;
    listStatus: {
      status:
        | 'watching'
        | 'completed'
        | 'on_hold'
        | 'dropped'
        | 'plan_to_watch';
      score: number;
      num_episodes_watched: number;
    };
  };
};

export const MyAnimeListButton = ({ details }: MyAnimeListButtonProps) => {
  return !details.listStatus ?
      <AddToListButton malId={details.mal_id!} />
    : <UpdateAnimeButton details={details} />;
};
