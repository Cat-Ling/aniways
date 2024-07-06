export type Routes = "GET" | "POST" | "PATCH" | "DELETE";

export type Handler = (request: Request) => Promise<Response>;

export type AuthRouteHandler = Record<Routes, Handler>;
