import type { NextRequest } from "next/server";
import { redirect, RedirectType } from "next/navigation";

export const GET = (req: NextRequest) => {
  const redirectUrl = req.nextUrl.searchParams.get("redirect");
  const signOutUrl = new URL(
    `${req.nextUrl.origin}/api/myanimelist/auth/sign-out`
  );

  if (redirectUrl) {
    signOutUrl.searchParams.set("redirectUrl", redirectUrl);
  }

  redirect(signOutUrl.toString(), RedirectType.replace);
};
