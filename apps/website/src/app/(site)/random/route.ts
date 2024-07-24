import { redirect, RedirectType } from "next/navigation";

import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const anime = await api.anime.random();

  if (!anime) {
    return redirect("/404", RedirectType.replace);
  }

  redirect(`/anime/${anime.id}`, RedirectType.replace);
};
