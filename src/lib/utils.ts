import pLimit from "p-limit";

export const isValidateUrl = (url: string): boolean => {
  return /https:\/\/[a-zA-Z0-9]+.cybozu.com\//.test(url);
};

export const promiseAll = async <T>(
  promises: Promise<T>[],
  limit: number
): Promise<T[]> => {
  const Limit = pLimit(limit);
  const _promises = promises.map((p) => {
    return Limit(() => p);
  });

  const result = await Promise.all(_promises);
  return result;
};
