import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";

const DependencySchema = z.object({
  isDown: z.boolean(),
  date: z.coerce.date(),
});

const ResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  dependencies: z.object({
    myAnimeList: DependencySchema,
    episodes: DependencySchema,
    website: DependencySchema,
  }),
});

export const useHealthCheck = () => {
  return useSuspenseQuery({
    queryKey: ["healthcheck"],
    queryFn: async () => {
      try {
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        const url = import.meta.env.VITE_APP_API_URL;

        const response = await fetch(url)
          .then((res) => res.json())
          .then(ResponseSchema.parse.bind(null));

        return response;
      } catch {
        return {
          message: "An error occurred",
          success: false,
          dependencies: {
            myAnimeList: {
              isDown: true,
              date: new Date(),
            },
            episodes: {
              isDown: true,
              date: new Date(),
            },
            website: {
              isDown: true,
              date: new Date(),
            },
          },
        };
      }
    },
  });
};
