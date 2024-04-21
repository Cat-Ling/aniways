export type Routes = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// eslint-disable-next-line no-unused-vars
export type Handler = (request: Request) => Promise<Response>;

export type AuthRouteHandler = Record<Routes, Handler>;
