'use client';
import { Button } from '@aniways/ui/components/ui/button';
import {
  DialogClose,
  DialogFooter,
  useDialogContext,
} from '@aniways/ui/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  reactHookForm,
  zodResolver,
} from '@aniways/ui/components/ui/form';
import { Input } from '@aniways/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@aniways/ui/components/ui/select';
import { toast } from '@aniways/ui/components/ui/sonner';
import { Loader2, MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import {
  deleteAnimeInListAction,
  updateAnimeInListAction,
} from './myanimelist-actions';

const status = [
  'watching',
  'completed',
  'on_hold',
  'dropped',
  'plan_to_watch',
] as const;

const scores = [
  { value: 0 },
  { value: 1, label: '(1) Appalling' },
  { value: 2, label: '(2) Horrible' },
  { value: 3, label: '(3) Very Bad' },
  { value: 4, label: '(4) Bad' },
  { value: 5, label: '(5) Average' },
  { value: 6, label: '(6) Fine' },
  { value: 7, label: '(7) Good' },
  { value: 8, label: '(8) Very Good' },
  { value: 9, label: '(9) Great' },
  { value: 10, label: '(10) Masterpiece' },
];

const UpdateAnimeSchema = z.object({
  status: z.enum(
    ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'],
    {
      required_error: 'Please select a status',
    }
  ),
  episodesWatched: z.coerce
    .number({
      required_error: 'Please enter the number of episodes watched',
    })
    .int({
      message: 'Please enter a valid episode number',
    })
    .min(0, {
      message: 'Please enter a valid episode number',
    }),
  score: z.coerce.number().int().min(0).max(10).optional(),
});

type UpdateAnimeFormProps = {
  malId: number;
  listStatus: {
    status: (typeof status)[number];
    num_episodes_watched: number;
    score: number;
  };
};

export const UpdateAnimeForm = ({
  malId,
  listStatus,
}: UpdateAnimeFormProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { close } = useDialogContext();

  const form = reactHookForm.useForm<z.infer<typeof UpdateAnimeSchema>>({
    resolver: zodResolver(UpdateAnimeSchema),
    defaultValues: {
      status: listStatus.status,
      episodesWatched: listStatus.num_episodes_watched,
      score: listStatus.score,
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    try {
      const { error, success } = await updateAnimeInListAction(
        malId,
        data.status,
        data.episodesWatched,
        data.score ?? 0
      );

      if (error || !success) {
        throw new Error(error);
      }

      toast('List updated', {
        description: 'Your list has been updated',
      });

      close();
    } catch (e) {
      console.error(e);

      const error = e instanceof Error ? e : new Error('Failed to update list');

      toast(error.message, {
        description: 'Please try again later',
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="episodesWatched"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episodes Watched</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Episodes Watched"
                    type="number"
                  />
                </FormControl>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  type="button"
                  onClick={field.onChange.bind(null, field.value - 1)}
                >
                  <MinusIcon />
                </Button>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  type="button"
                  onClick={field.onChange.bind(null, field.value + 1)}
                >
                  <PlusIcon />
                </Button>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={
                  field.value === 0 ? undefined : String(field.value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Score" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {scores
                    .filter(score => score.label)
                    .reverse()
                    .map(score => (
                      <SelectItem key={score.value} value={String(score.value)}>
                        {score.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <DialogFooter className="mt-6 w-full sm:justify-between">
          <DialogClose asChild>
            <Button variant={'secondary'} type="button">
              Cancel
            </Button>
          </DialogClose>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant={'secondary'}
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true);
                try {
                  const { success, error } =
                    await deleteAnimeInListAction(malId);

                  if (error || !success) {
                    throw new Error('Failed to delete anime');
                  }

                  toast('Anime deleted', {
                    description: 'Anime has been removed from your list',
                  });
                  close();
                } catch (e) {
                  console.error(e);

                  const error =
                    e instanceof Error ? e : (
                      new Error('Failed to delete anime')
                    );

                  toast(error.message, {
                    description: 'Please try again later',
                  });
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ?
                <Loader2 className="animate-spin" />
              : 'Delete Entry'}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ?
                <Loader2 className="animate-spin" />
              : 'Update Anime'}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
};
