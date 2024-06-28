import { z } from "zod";

export const UpdateAnimeSchema = z.object({
  malLink: z
    .string({
      required_error: "Please enter a valid MAL link",
    })
    .min(1, "Please enter a valid MAL link")
    .url({
      message: "Please enter a valid MAL link",
    })
    .refine(
      value => {
        const { success } = z.string().url().safeParse(value);
        if (!success) return false;
        const url = new URL(value);
        return (
          url.hostname === "myanimelist.net" &&
          url.pathname.includes("/anime/") &&
          url.pathname.split("/").length === 4
        );
      },
      {
        message: "Please enter a valid MAL link",
      }
    )
    .transform(value => {
      const { success } = z.string().url().safeParse(value);
      if (!success) return false;
      const url = new URL(value);
      return url.pathname.split("/")[2];
    })
    .refine(
      value => {
        return !isNaN(Number(value));
      },
      {
        message: "Please enter a valid MAL link",
      }
    )
    .transform(value => Number(value)),
});
