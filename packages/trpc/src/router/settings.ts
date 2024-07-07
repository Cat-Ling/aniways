import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { orm, schema } from "@aniways/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const settingsRouter = createTRPCRouter({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const malId = ctx.session.user.id;

    const [user] = await ctx.db
      .select({ settings: schema.users.settings })
      .from(schema.users)
      .where(orm.eq(schema.users.malId, malId))
      .limit(1);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user.settings;
  }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        autoNext: z.boolean(),
        autoPlay: z.boolean(),
        autoUpdateMal: z.boolean(),
        darkMode: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const malId = ctx.session.user.id;

      await ctx.db
        .update(schema.users)
        .set({ settings: input })
        .where(orm.eq(schema.users.malId, malId));

      return input;
    }),
});
