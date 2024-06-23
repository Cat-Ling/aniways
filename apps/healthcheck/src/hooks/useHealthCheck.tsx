import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const ResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  dependencies: z.object({
    myAnimeList: z.boolean(),
    episodeService: z.boolean(),
    website: z.boolean(),
  }),
});

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["healthcheck"],
    queryFn: async () => {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      const url = `${import.meta.env.VITE_API_ENDPOINT}/api/healthcheck`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch healthcheck");
      }

      return ResponseSchema.parse(await response.json());
    },
  });
};
