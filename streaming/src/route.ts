/**
 * Represents a route in the server.
 * @param pathTemplate The path template for the route.
 * @param handler The handler for the route.
 * @returns The route.
 * @example
 * const route = new Route('/info/:xrax', async (req, params) => {
 *  const xrax = params.xrax;
 *  // Handle the request
 * });
 * routes.push(route);
 */
export class Route {
  constructor(
    public pathTemplate: string,
    public handler: (
      req: Request,
      params: Record<string, string>
    ) => Promise<Response>
  ) {
    this.pathTemplate = pathTemplate;
    this.handler = handler;
  }

  private match(pathname: string): Record<string, string> | null {
    const templateParts = this.pathTemplate.split('/');
    const pathnameParts = pathname.split('/');

    if (templateParts.length !== pathnameParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < templateParts.length; i++) {
      const templatePart = templateParts[i];
      const pathnamePart = pathnameParts[i];

      if (templatePart.startsWith(':')) {
        const paramName = templatePart.slice(1);
        params[paramName] = pathnamePart;
      } else if (templatePart !== pathnamePart) {
        return null;
      }
    }

    return params;
  }

  async handle(req: Request): Promise<Response | null> {
    const url = new URL(req.url);
    const params = this.match(url.pathname);
    if (params) {
      return await this.handler(req, params);
    }
    return null;
  }
}
