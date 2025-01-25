import { cookies } from "next/headers";
import { getOriginUrl } from "../utils";

export async function signOut(req: Request) {
  const url = new URL(req.url);

  const redirectUrl = url.searchParams.get("redirectUrl") ?? getOriginUrl();

  const headers = new Headers();

  const cookiesStore = await cookies();

  cookiesStore.delete("mal.session");
  cookiesStore.delete("mal.csrf");
  cookiesStore.delete("mal.code_challenge");
  cookiesStore.delete("mal.access_token");
  cookiesStore.delete("redirectUrl");

  headers.append("Location", redirectUrl);

  const response = new Response(null, {
    status: 302,
    headers: headers,
  });

  return response;
}
