import { env } from "@/env";

export const getOriginUrl = () => {
  return process.env.NODE_ENV === "production"
    ? `https://${env.DOMAIN}`
    : "http://localhost:3000";
};
