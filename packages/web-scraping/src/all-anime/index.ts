import parse from "node-html-parser";

const getAnimeFromGogoAnime = async (page: number) => {
  return fetch(`https://gogoanime3.co/anime-list.html?page=${page}`)
    .then((res) => res.text())
    .then((html) => {
      return parse(html)
        .querySelectorAll(".listing li")
        .map((li) => {
          const element = li.getAttribute("title");
          if (!element) return;
          const dom = parse(`<div>${element}</div>`);
          const image = dom.querySelector("img")?.getAttribute("src");
          const name = dom.querySelector(".bigChar")?.innerText;
          const genres = dom
            .querySelectorAll(".type a")
            .map((a) => a.getAttribute("title"));
          const released = dom
            .querySelectorAll(".type")
            .map((a) =>
              a.innerText.includes("Released")
                ? a.innerText.replace("Released: ", "").trim()
                : null,
            )
            .find((year) => year !== null);
          const status = dom
            .querySelectorAll(".type")
            .map((a) =>
              a.innerText.includes("Status")
                ? a.innerText.replace("Status: ", "").trim()
                : null,
            )
            .find((status) => status !== null);
          const description = dom
            .querySelector(".sumer")
            ?.innerText.replace("Plot Summary: ", "")
            .trim();
          const slug = li
            .querySelector("a")
            ?.getAttribute("href")
            ?.split("/")
            .at(-1);
          return {
            name,
            image,
            genres,
            released,
            status,
            description,
            slug,
          };
        });
    });
};

export default getAnimeFromGogoAnime;
