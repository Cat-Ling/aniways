export const sanitizeName = (name: string) => {
  const textOnly = name.replace(/[^a-zA-Z0-9- ]/g, "");

  const finalString = textOnly.replace(/\s+/g, "-");

  return encodeURIComponent(finalString.toLowerCase());
};
