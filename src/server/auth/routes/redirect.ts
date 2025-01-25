import { cookies } from "next/headers";
import { auth } from "..";
import { db, schema } from "@/server/db";
import { getOriginUrl } from "../utils";

export async function redirect(req: Request) {
  const cookieStore = await cookies();

  const session = await auth(cookieStore);

  if (session) {
    await db
      .insert(schema.users)
      .values({
        malId: session.user.id,
        username: session.user.name,
        gender: session.user.gender,
        picture: session.user.picture,
      })
      .onConflictDoNothing();
  }

  const redirectUrl = cookieStore.get("redirectUrl")?.value;

  req.headers.append("Location", redirectUrl ?? getOriginUrl());

  const response = new Response(null, {
    status: 302,
    headers: req.headers,
  });

  return response;
}
