import { redirect, RedirectType } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = (req: NextRequest) => {
  const redirectUrl = req.nextUrl.searchParams.get("redirect");
  const signInUrl = new URL(
    `${req.nextUrl.origin}/api/myanimelist/auth/sign-in`
  );

  if (redirectUrl) {
    signInUrl.searchParams.set("redirectUrl", redirectUrl);
  }

  redirect(signInUrl.toString(), RedirectType.replace);
};
