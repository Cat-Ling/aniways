export const convertToBase64 = (str: string) => {
  return Buffer.from(str).toString("base64url");
};

export const convertFromBase64 = (str: string) => {
  return Buffer.from(str, "base64url").toString("utf-8");
};
