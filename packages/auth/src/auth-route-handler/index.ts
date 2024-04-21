import { authRouteHandler } from '@aniways/myanimelist';
import { api } from './api';

export const createAuthRouteHandler = () => ({
  ...authRouteHandler,
  GET: api,
});
