import { load } from "cheerio";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { convertFromBase64, convertToBase64 } from "../utils/base64";

const SearchOutput = z.object({
  results: z
    .object({
      id: z.string(),
      image: z.string(),
      title: z.string(),
    })
    .array(),
});

export const mangaRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const $ = await fetch(
        `https://mangakakalot.com/search/story/${input.query.replace(/\s/g, "_")}`
      )
        .then(res => res.text())
        .then(load);

      const results = $("div.daily-update > div > div")
        .map((i, el) => ({
          title: $(el).find("div > h3 > a").text(),
          image: $(el).find("a > img").attr("src"),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          url: $(el).find("div > h3 > a").attr("href")!,
        }))
        .get();

      return SearchOutput.parse({
        results: results.map(result => ({
          title: result.title,
          image: result.image,
          // encrypt infoUrl into id
          id: convertToBase64(result.url),
        })),
      });
    }),

  getMangaInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const url = convertFromBase64(input.id);
      const $ = await fetch(url)
        .then(res => res.text())
        .then(load);

      const title = $("div.story-info-right > h1").text();

      const image = $("div.panel-story-info > div.story-info-left img").attr(
        "src"
      );

      const description = $("#panel-story-info-description")
        .text()
        .replace("Description :", "")
        .trim();

      const altTitles = $(
        "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(1)"
      )
        .text()
        .replace("Alternative :", "")
        .trim()
        .split(";")
        .map(title => title.trim());

      const author = $(
        "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(2)"
      )
        .text()
        .replace("Author(s) :", "")
        .trim();

      const status = $(
        "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(3)"
      )
        .text()
        .replace("Status :", "")
        .trim();

      const genres = $(
        "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(4)"
      )
        .text()
        .replace("Genres :", "")
        .trim()
        .split("-")
        .map(genre => genre.trim());

      const lastUpdated = $("div.story-info-right-extent > p:nth-child(1)")
        .text()
        .replace("Updated :", "")
        .trim();

      const chapters = $(".panel-story-chapter-list > ul > li")
        .map((i, el) => {
          const $el = $(el);
          const title = $el.find("a").text();
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const url = $el.find("a").attr("href")!;
          const uploaded = $el.find("span:last-child").text();

          return {
            title,
            url,
            uploaded,
          };
        })
        .get();

      return {
        id: input.id,
        title,
        image,
        description,
        altTitles,
        author,
        status,
        genres,
        lastUpdated,
        chapters: chapters.map(chapter => ({
          ...chapter,
          id: convertToBase64(chapter.url),
        })),
      };
    }),

  getChapterPages: publicProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(async ({ input }) => {
      const url = convertFromBase64(input.chapterId);

      console.log(url);

      const $ = await fetch(url)
        .then(res => res.text())
        .then(load);

      const prevUrl = $(
        ".navi-change-chapter-btn .navi-change-chapter-btn-prev"
      ).attr("href");
      const nextUrl = $(
        ".navi-change-chapter-btn .navi-change-chapter-btn-next"
      ).attr("href");

      const chapterList = $(".navi-change-chapter option")
        .map((i, el) => {
          const $el = $(el);
          const title = $el.text();
          const chapter = $el.attr("data-c");
          const chapterUrl = url.replace(/chapter-\d+/, `chapter-${chapter}`);

          return {
            id: convertToBase64(chapterUrl),
            title,
            chapter,
            url: chapterUrl,
          };
        })
        .get();

      const images = $(".container-chapter-reader > img")
        .map((i, el) => {
          const url = $(el).attr("src");
          const alt = $(el).attr("alt")?.replace("- MangaNato.com", "").trim();

          return {
            url: convertToBase64(`${url}`),
            alt,
          };
        })
        .get();

      return {
        prev: prevUrl ? convertToBase64(prevUrl) : null,
        next: nextUrl ? convertToBase64(nextUrl) : null,
        images,
        pages: images.length,
        chapterList,
      };
    }),
});
