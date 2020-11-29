export const isValidateUrl = (url: string): boolean => {
  return /https:\/\/[a-zA-Z0-9]+.cybozu.com\//.test(url);
};
