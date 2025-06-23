import { PUBLIC_API_URL } from '$env/static/public';
import { fetchJson, mutate, StatusError } from '$lib/api';
import {
  loginFormSchema,
  profilePictureUploadResultSchema,
  providerSchema,
  registerFormSchema,
  resetPasswordFormSchema,
  updatePasswordFormSchema,
  updateUserFormSchema,
  user
} from './types';

export const getCurrentUser = async (fetch: typeof global.fetch) => {
  return fetchJson(fetch, '/auth/me', user).catch((e) => {
    if (e instanceof StatusError && e.status === 401) return null;
    throw e;
  });
};

export const login = async (fetch: typeof global.fetch, body: typeof loginFormSchema.infer) => {
  return mutate(fetch, '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

export const register = async (
  fetch: typeof global.fetch,
  body: typeof registerFormSchema.infer
) => {
  return mutate(fetch, '/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

export const updateUser = async (
  fetch: typeof global.fetch,
  body: typeof updateUserFormSchema.infer
) => {
  return mutate(fetch, '/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...body,
      password: null,
      confirmPassword: null
    })
  });
};

export const updateUserPassword = async (
  fetch: typeof global.fetch,
  body: typeof updatePasswordFormSchema.infer
) => {
  return mutate(fetch, '/users/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

export const uploadImage = async (fetch: typeof global.fetch, file: File) => {
  const bytes = await file.arrayBuffer();
  const response = await mutate(fetch, '/users/image', {
    method: 'POST',
    body: bytes,
    headers: {
      'Content-Type': file.type
    }
  });
  return profilePictureUploadResultSchema.assert(await response.json());
};

export const getLogoutUrl = (currentPageUrl: string | undefined) => {
  return `${PUBLIC_API_URL}/auth/logout${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};

export const getMyanimeListUrl = (currentPageUrl: string | undefined) => {
  return `${PUBLIC_API_URL}/auth/myanimelist/login${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};

export const getMyAnimeListLogoutUrl = () => {
  return `${PUBLIC_API_URL}/auth/providers/myanimelist/logout`;
};

export const getInstalledProviders = async (fetch: typeof global.fetch) => {
  return fetchJson(fetch, '/auth/providers', providerSchema.array());
};

export const forgotPassword = async (fetch: typeof global.fetch, email: string) => {
  return mutate(fetch, '/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
};

export const getUserFromToken = async (fetch: typeof global.fetch, token: string) => {
  return fetchJson(fetch, `/auth/user/${token}`, user).catch((e) => {
    if (e instanceof StatusError && e.status === 401) return null;
    throw e;
  });
};

export const resetPassword = async (
  fetch: typeof global.fetch,
  body: typeof resetPasswordFormSchema.infer
) => {
  return mutate(fetch, '/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};
