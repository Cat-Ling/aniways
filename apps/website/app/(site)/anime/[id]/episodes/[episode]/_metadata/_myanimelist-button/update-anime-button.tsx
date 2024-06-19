import { Button } from '@aniways/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@aniways/ui/components/ui/dialog';
import { UpdateAnimeForm } from './update-anime-form';

type UpdateAnimeButtonProps = {
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

export const UpdateAnimeButton = ({ details }: UpdateAnimeButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Update Anime</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Anime - {details.title}</DialogTitle>
        <DialogDescription>
          Update the anime in your MyAnimeList Anime List
        </DialogDescription>
        <UpdateAnimeForm
          malId={details.mal_id!}
          listStatus={details.listStatus}
        />
      </DialogContent>
    </Dialog>
  );
};
