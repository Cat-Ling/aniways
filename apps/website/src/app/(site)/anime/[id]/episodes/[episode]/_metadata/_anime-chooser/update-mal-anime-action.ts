"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { auth } from "@aniways/auth";
import { createMyAnimeListService, MyAnimeListService } from "@aniways/data";

export const updateMalAnimeAction = async (id: string, malId: number) => {
  const user = await auth(cookies());

  const { syncAnimeMetadataFromMyAnimeList } = createMyAnimeListService();

  const details = await syncAnimeMetadataFromMyAnimeList(
    user?.accessToken,
    id,
    malId
  ).catch(err => {
    if (err === MyAnimeListService.NOT_FOUND) return null;
    throw err;
  });

  revalidatePath(`/anime/${id}`, "layout");

  return details;
};
