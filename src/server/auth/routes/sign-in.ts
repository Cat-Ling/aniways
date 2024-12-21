import { cookies } from "next/headers";
import { type Handler } from "..";

export const signIn = (handler: Handler) => async (req: Request) => {
  const url = new URL(req.url);

  const redirectUrl = url.searchParams.get("redirectUrl") ?? url.origin;

  const res = await handler(req);

  const cookieStore = await cookies();
  cookieStore.set("redirectUrl", redirectUrl);

  return res;
};
