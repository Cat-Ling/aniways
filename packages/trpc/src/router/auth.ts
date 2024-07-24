import { orm, schema } from "@aniways/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getLoggedInUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: orm.eq(schema.users.malId, ctx.session.user.id),
    });
  }),
});
