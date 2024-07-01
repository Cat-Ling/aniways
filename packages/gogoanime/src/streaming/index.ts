import { Buffer } from "node:buffer";
import { createCipheriv, createDecipheriv } from "node:crypto";
import { parse } from "node-html-parser";

const BASE_URL = "https://anitaku.to";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";

const keys = {
  key: Buffer.from("37911490979715163134003223491201", "utf8"),
  secondKey: Buffer.from("54674138327930866480207815084989", "utf8"),
  iv: Buffer.from("3134003223491201", "utf8"),
};

function encrypt(text: string, key: Buffer = keys.key, iv: Buffer = keys.iv) {
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(
  encryptedText: string,
  key: Buffer = keys.key,
  iv: Buffer = keys.iv
) {
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export const getStreamingUrl = async (episodeSlug: string) => {
  try {
    const episodePage = await fetch(`${BASE_URL}/${episodeSlug}`, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    })
      .then(res => res.text())
      .then(parse);

    const server = episodePage
      .querySelector("#load_anime > div > div > iframe")
      ?.getAttribute("src");

    if (!server) {
      throw new Error("Server not found");
    }

    const videoUrl = new URL(server);

    const streamingPage = await fetch(videoUrl.href, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    })
      .then(res => res.text())
      .then(parse);

    const id = videoUrl.searchParams.get("id");

    if (!id) {
      throw new Error("Id not found");
    }

    const encryptedKey = encrypt(id);

    const scriptValue = streamingPage
      .querySelector('script[data-name="episode"]')
      ?.getAttribute("data-value");

    if (!scriptValue) {
      throw new Error("Script value not found");
    }

    const token = decrypt(scriptValue);

    const encryptedData = await fetch(
      `${videoUrl.protocol}//${videoUrl.hostname}/encrypt-ajax.php?id=${encryptedKey}&alias=${id}&${token}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    )
      .then(async res => (await res.json()) as { data: string })
      .then(data => data.data);

    const decryptedData = JSON.parse(
      decrypt(encryptedData, keys.secondKey)
    ) as {
      source: { file: string }[];
      source_bk: { file: string }[];
      track?: { tracks?: { file?: string }[] };
      linkiframe: string;
    };

    const sources = [] as {
      url: string;
      isM3U8: boolean;
      quality: "default" | "backup";
    }[];

    decryptedData.source.forEach(source => {
      sources.push({
        url: source.file,
        isM3U8: source.file.includes(".m3u8"),
        quality: "default",
      });
    });

    decryptedData.source_bk.forEach(source => {
      sources.push({
        url: source.file,
        isM3U8: source.file.includes(".m3u8"),
        quality: "backup",
      });
    });

    return {
      sources,
      tracks: decryptedData.track?.tracks,
      iframe: {
        default: videoUrl.href,
        backup: decryptedData.linkiframe,
      },
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
