interface Cookies {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string) => void;
  delete: (name: string) => void;
}

export const cookies = (req: Request, responseHeaders: Headers): Cookies => {
  const cookieHeader = req.headers.get("Cookie");
  const cookies = (cookieHeader
    ?.split(";")
    .map((cookie) => {
      const [name, value] = cookie.split("=");

      if (!name || !value) {
        return null;
      }

      return { name: name.trim(), value: value.trim() };
    })
    .filter((cookie) => cookie) ?? []) as { name: string; value: string }[];

  return {
    get: (name) => cookies.find((cookie) => cookie.name === name),
    set: (name, value) => {
      const cookie = `${name}=${value}; Path=/; Secure; HttpOnly; SameSite=None`;
      responseHeaders.append("Set-Cookie", cookie);
    },
    delete: (name) => {
      const cookie = `${name}=; Path=/; Secure; HttpOnly; SameSite=None; Max-Age=0`;
      responseHeaders.append("Set-Cookie", cookie);
    },
  };
};
