import { createAuthRouteHandler } from "@aniways/auth/server";

export const { GET, POST, DELETE, PATCH } = createAuthRouteHandler();
