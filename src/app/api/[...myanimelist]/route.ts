import { createAuthRouteHandler } from "@/server/auth";

export const { GET, POST, PATCH, DELETE } = createAuthRouteHandler();
