import { cookies } from "next/headers";
import { type Handler } from "..";
import { getOriginUrl } from "../utils";

export const signIn = (handler: Handler) => async (req: Request) => {
  const url = new URL(req.url);

  const redirectUrl = url.searchParams.get("redirectUrl") ?? getOriginUrl();

  const res = await handler(req);

  const cookieStore = await cookies();
  cookieStore.set("redirectUrl", redirectUrl);

  const location = res.headers.get("Location");

  if (!location) return res;

  const authUrl = new URL(location);

  authUrl.searchParams.set(
    "redirectUrl",
    `${getOriginUrl()}/api/myanimelist/auth/callback`,
  );

  res.headers.set("Location", authUrl.toString());

  return res;
};
