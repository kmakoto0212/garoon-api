import pLimit from "p-limit";

export const isValidateUrl = (url: string): boolean => {
  return /https:\/\/[a-zA-Z0-9]+\.cybozu\.com\//.test(url);
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

export const getISOString = (date: string): string => {
  const [
    ,
    year,
    month,
    day,
    hour,
    minitts,
  ] = /([0-9]{4})年([0-9]{2})月([0-9]{2})日（.{1}） ([0-9]{2}):([0-9]{2})/.exec(
    date
  );
  const strDate = `${year}-${month}-${day}T${hour}:${minitts}:00`;
  const Data = new Date(strDate);
  return Data.toISOString();
};
