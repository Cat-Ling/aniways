import { MANGA } from "@consumet/extensions";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const mangaRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const manga = new MANGA.MangaKakalot();

      return manga.search(input.query);
    }),

  getMangaInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const manga = new MANGA.MangaKakalot();

      return manga.fetchMangaInfo(input.id);
    }),

  getChapterPages: publicProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(async ({ input }) => {
      const manga = new MANGA.MangaKakalot();

      return manga.fetchChapterPages(input.chapterId);
    }),
});
