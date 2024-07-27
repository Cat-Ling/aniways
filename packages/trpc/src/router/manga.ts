import { TRPCError } from "@trpc/server";
import { load } from "cheerio";
import { z } from "zod";

import { createId, orm, schema } from "@aniways/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
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

      if (url.includes("mangakakalot")) {
        const title = $(
          "div.manga-info-top > ul > li:nth-child(1) > h1"
        ).text();

        const image = $("div.manga-info-top > div.manga-info-pic > img").attr(
          "src"
        );

        const description = $("#noidungm")
          .text()
          .replace(`${title} summary:`, "")
          .trim();

        const altTitles = $(
          ".manga-info-top > ul > li:nth-child(1) > h2.story-alternative"
        )
          .text()
          .replace("Alternative :", "")
          .trim()
          .split(";")
          .map(title => title.trim());

        const author = $(".manga-info-top > ul > li:nth-child(2)")
          .text()
          .replace("Author(s) :", "")
          .trim();

        const status = $(".manga-info-top > ul > li:nth-child(3)")
          .text()
          .replace("Status :", "")
          .trim();

        const genres = $(".manga-info-top > ul > li:nth-child(7)")
          .text()
          .replace("Genres :", "")
          .trim()
          .split(",")
          .map(genre => genre.trim());

        const lastUpdated = $(".manga-info-top > ul > li:nth-child(4)")
          .text()
          .replace("Last updated :", "")
          .trim();

        const chapters = $(".chapter-list > div.row")
          .map((i, el) => {
            const $el = $(el);
            const title = $el.find("span:nth-child(1)").text();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const url = $el.find("a").attr("href")!;
            const uploaded = $el.find("span:nth-child(3)").text();

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
      }

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

      const $ = await fetch(url)
        .then(res => res.text())
        .then(load);

      const mangaId = convertToBase64(
        $(
          "body > div.body-site > div:nth-child(1) > div.panel-breadcrumb > a:nth-child(3)"
        ).attr("href") ??
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          $("body > div:nth-child(2) > p > span:nth-child(3) > a").attr("href")!
      );

      const title =
        $(".info-top-chapter > h2").text() ||
        $("div.panel-chapter-info-top > h1").text();

      const prevUrl =
        $(".navi-change-chapter-btn .navi-change-chapter-btn-prev").attr(
          "href"
        ) ?? $(".btn-navigation-chap > a:nth-child(1)").attr("href");

      const nextUrl =
        $(".navi-change-chapter-btn .navi-change-chapter-btn-next").attr(
          "href"
        ) ?? $(".btn-navigation-chap > a:nth-child(2)").attr("href");

      const chapterList = [
        ...new Set(
          $(".navi-change-chapter option")
            .map((i, el) => {
              const $el = $(el);
              const title = $el.text();
              const chapter = $el.attr("data-c");
              const chapterUrl = url
                .replace(/chapter-[0-9]+(\.[0-9]+)?/, `chapter-${chapter}`)
                .replace(/chapter_[0-9]+(\.[0-9]+)?/, `chapter_${chapter}`);

              return JSON.stringify({
                title,
                chapter,
                chapterUrl,
              });
            })
            .get()
        ),
      ].map(c => {
        const { title, chapter, chapterUrl } = JSON.parse(c) as {
          title: string;
          chapter: string;
          chapterUrl: string;
        };

        return {
          id: convertToBase64(chapterUrl),
          title,
          chapter: Number(chapter),
        };
      });

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
        id: input.chapterId,
        mangaId,
        title,
        prevId: prevUrl ? convertToBase64(prevUrl) : null,
        nextId: nextUrl ? convertToBase64(nextUrl) : null,
        images,
        pages: images.length,
        chapterList,
      };
    }),

  saveToLibrary: protectedProcedure
    .input(
      z.object({
        mangaId: z.string(),
        name: z.string(),
        image: z.string(),
        chapterId: z.string(),
        chapter: z.string(),
        page: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: orm.eq(schema.users.malId, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const existingMangaLibrary = await ctx.db.query.library.findFirst({
        where: orm.and(
          orm.eq(schema.library.userId, user.id),
          orm.eq(schema.library.mangaId, input.mangaId)
        ),
      });

      if (existingMangaLibrary) {
        await ctx.db
          .update(schema.library)
          .set({
            chapterId: input.chapterId,
            chapter: input.chapter,
            page: input.page,
          })
          .where(orm.eq(schema.library.id, existingMangaLibrary.id));

        return;
      }

      await ctx.db.insert(schema.library).values({
        id: createId(),
        userId: user.id,
        chapter: input.chapter,
        chapterId: input.chapterId,
        mangaData: {
          title: input.name,
          image: input.image,
        },
        mangaId: input.mangaId,
        page: input.page,
      });
    }),
});
