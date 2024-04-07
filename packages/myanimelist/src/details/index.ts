import { Jikan4 } from 'node-myanimelist';
import { MALClient } from '@animelist/client';
import { distance } from 'fastest-levenshtein';

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

const getListStatusAndRelatedAnimeFromMAL = (
  malId: number,
  accessToken: string | undefined
) => {
  const client = new MALClient(
    accessToken ?
      { accessToken }
    : {
        // eslint-disable-next-line
        clientId: process.env.MAL_CLIENT_ID!,
      }
  );

  return client
    .getAnimeDetails(malId, {
      fields: ['my_list_status', 'related_anime'],
    })
    .then(async res => ({
      listStatus: res?.my_list_status,
      relatedAnime: res?.related_anime ?? [],
    }));
};

export default async function getAnimeDetails(args: Args) {
  const { accessToken } = args;

  if ('malId' in args) {
    console.log('Getting anime details of', args.malId);

    return {
      ...(await Jikan4.anime(args.malId)
        .info()
        .then(res => res.data)),
      ...(await getListStatusAndRelatedAnimeFromMAL(args.malId, accessToken)),
    };
  }

  console.log('Getting anime details of', args.title);

  const data = (await Jikan4.animeSearch({ q: encodeURI(args.title) })).data
    .map(anime => ({
      ...anime,
      distance: distance(anime.title ?? '', args.title),
    }))
    .sort((a, b) => a.distance - b.distance)
    .at(0);

  if (!data || !data.mal_id) {
    return undefined;
  }

  return {
    ...data,
    ...(await getListStatusAndRelatedAnimeFromMAL(data.mal_id, accessToken)),
  };
}
