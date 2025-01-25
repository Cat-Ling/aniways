import { env } from "@/env";
import { cookies } from "next/headers";
import { getOriginUrl } from "../utils";
import { z } from "zod";
import { decodeJwt, SignJWT } from "jose";

export async function callback(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const codeChallenge = await cookies().then(
    (cookies) => cookies.get("mal.code_challenge")?.value,
  );

  if (!code || !state || !codeChallenge) {
    return new Response(null, { status: 400 });
  }

  const csrf = await cookies().then(
    (cookies) => cookies.get("mal.csrf")?.value,
  );

  if (state !== csrf) {
    return new Response(null, { status: 400 });
  }

  const token = await getToken(codeChallenge, code);
  const userId = await getUserId(token.access_token);

  if (!userId) {
    return new Response(null, { status: 401 });
  }

  const sessionToken = await generateJwt(userId, token.refresh_token);

  const cookieStore = await cookies();
  cookieStore.set("mal.session", sessionToken, {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  const { access_token, expires_in } = await refreshToken(token.refresh_token);

  cookieStore.set("mal.access_token", access_token, {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expires_in,
  });

  cookieStore.delete("mal.code_challenge");

  return new Response(null, {
    status: 302, // Redirect
    headers: {
      Location: `${getOriginUrl()}/api/myanimelist/auth/redirect`,
    },
  });
}

const GetTokenResponseSchema = z.object({
  token_type: z.literal("Bearer"),
  expires_in: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
});

async function getToken(codeVerifier: string, code: string) {
  const url = new URL("https://myanimelist.net/v1/oauth2/token");
  const searchParams = new URLSearchParams({
    client_id: env.MAL_CLIENT_ID,
    client_secret: env.MAL_CLIENT_SECRET,
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
    code,
    redirect_uri: `${getOriginUrl()}/api/myanimelist/auth/callback`,
  });

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: searchParams,
  });

  if (!response.ok) {
    const msg = await response.text();
    console.error(msg);
    throw new Error(msg);
  }

  const data = (await response.json()) as unknown;

  return GetTokenResponseSchema.parse(data);
}

async function getUserId(accessToken: string) {
  const claims = decodeJwt(accessToken);

  if (claims.sub === null) {
    return null;
  }

  const userId = Number(claims.sub);
  return Number.isNaN(userId) ? null : userId;
}

async function generateJwt(
  userId: number,
  refreshToken: string,
): Promise<string> {
  const signJwt = new SignJWT({ refreshToken, sub: String(userId) })
    .setExpirationTime(Date.now() + 60 * 60 * 24 * 7) // 7 days
    .setAudience("mal.audience")
    .setIssuer("mal.issuer")
    .setProtectedHeader({ alg: "HS256" });

  const encoder = new TextEncoder();
  const key = encoder.encode(env.MAL_SECRET_KEY);

  const jwt = await signJwt.sign(key);
  return jwt;
}

const RefreshTokenResponseSchema = z.object({
  token_type: z.literal("Bearer"),
  expires_in: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
});

async function refreshToken(token: string) {
  const url = new URL("https://myanimelist.net/v1/oauth2/token");
  const searchParams = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: token,
  });

  const credentials = convertToBase64(
    `${env.MAL_CLIENT_ID}:${env.MAL_CLIENT_SECRET}`,
  );

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: searchParams,
  });

  if (!res.ok) {
    const msg = await res.text();
    console.error(`${res.status} ${res.statusText} - ${msg}`);
    throw new Error(msg);
  }

  return RefreshTokenResponseSchema.parse(await res.json());
}

function convertToBase64(s: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(s).toString("base64");
  }

  if (typeof btoa !== "undefined") {
    return btoa(s);
  }

  throw new Error(
    "Unable to convert string to base64, 'Buffer' and 'btoa' are not supported",
  );
}
