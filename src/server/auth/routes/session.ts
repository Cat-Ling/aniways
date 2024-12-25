import { cookies } from "next/headers";
import { auth, type Handler } from "..";
import { db, schema } from "@/server/db";

export function session(handler: Handler) {
  return async (req: Request) => {
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

    return await handler(req);
  };
}
