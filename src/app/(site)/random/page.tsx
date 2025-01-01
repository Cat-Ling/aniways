import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

const RandomAnimePage = async () => {
  const random = await api.hiAnime.random();

  if (!random) {
    redirect("/404");
  }

  redirect(`/anime/${random}`);
};

export default RandomAnimePage;
