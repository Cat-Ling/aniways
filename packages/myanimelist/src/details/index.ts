import { Jikan4 } from 'node-myanimelist';
import { MALClient } from '@animelist/client';
import { LevenshteinDistance } from 'natural';

type Args = {
  accessToken: string | undefined;
} & (
  | {
      title: string;
    }
  | {
      malId: number;
    }
);

export default async function getAnimeDetails(args: Args) {
  const { accessToken } = args;

  const client = new MALClient(
    accessToken ?
      { accessToken }
    : {
        // eslint-disable-next-line
        clientId: process.env.MAL_CLIENT_ID!,
      }
  );

  if ('malId' in args) {
    console.log('Getting anime details of', args.malId);

    return {
      ...(await Jikan4.anime(args.malId)
        .info()
        .then(res => res.data)),
      listStatus: await client
        .getAnimeDetails(args.malId, { fields: ['my_list_status'] })
        .then(res => res?.my_list_status),
    };
  }

  console.log('Getting anime details of', args.title);

  const data = (await Jikan4.animeSearch({ q: args.title })).data
    .map(anime => ({
      ...anime,
      distance: LevenshteinDistance(anime.title ?? '', args.title),
    }))
    .sort((a, b) => a.distance - b.distance)
    .at(0);

  if (!data || !data.mal_id) {
    return undefined;
  }

  return {
    ...data,
    listStatus: await client
      .getAnimeDetails(data.mal_id, { fields: ['my_list_status'] })
      .then(res => res?.my_list_status),
  };
}
