import { createId, db, schema } from "@aniways/db";

import { auth } from "../../auth";
import { cookies } from "../cookies";

async function _redirect(req: Request) {
  const url = new URL(req.url);

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
    await db.insert(schema.users).values({
      id: createId(),
      malId: session.user.id,
      username: session.user.name,
      gender: session.user.gender,
      picture: session.user.picture,
    });
  }

  const redirectUrl = cookies(req, new Headers()).get("redirectUrl")?.value;

  req.headers.append("Location", redirectUrl ?? url.origin);

  const response = new Response(null, {
    status: 302,
    headers: req.headers,
  });

  return response;
}

export const redirect = Object.assign(_redirect, {
  url: "/api/myanimelist/auth/redirect",
});
