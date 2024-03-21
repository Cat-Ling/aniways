import { getUser } from '@animelist/auth-next/server';

type Auth = typeof getUser;

export const auth: Auth = async (cookies, options) => {
  try {
    // NOTE: ensure that it does not crash when invalid token is present
    return await getUser(cookies, options);
  } catch (e) {
    return undefined;
  }
};
