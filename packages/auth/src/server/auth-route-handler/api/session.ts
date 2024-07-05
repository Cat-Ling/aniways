import { createId, db, schema } from "@aniways/db";

import type { Handler } from "../types";
import { auth } from "../../auth";
import { cookies } from "../cookies";

function _session(handler: Handler) {
  return async (req: Request) => {
    const cookieStore = cookies(req, new Headers());

    const session = await auth({
      get: name => {
        if (typeof name === "string") {
          const value = cookieStore.get(name)?.value;

          return value ? { name, value } : undefined;
        }

        return name;
      },
      getAll: cookieStore.getAll,
      has: name => !!cookieStore.get(name),
    });

    if (session) {
      await db
        .insert(schema.users)
        .values({
          id: createId(),
          malId: session.user.id,
          username: session.user.name,
          gender: session.user.gender,
          picture: session.user.picture,
        })
        .onConflictDoNothing();
    }

    return await handler(req);
  };
}

export const session = (handler: Handler) => {
  return Object.assign(_session(handler), {
    url: "/api/myanimelist/auth/session",
  });
};
