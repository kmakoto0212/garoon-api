import pLimit from "p-limit";
import { URL } from "url";
export const isValidateUrl = (url) => {
  return /https:\/\/[a-zA-Z0-9]+\.cybozu\.com\//.test(url);
};
export const promiseAll = async (promises, limit) => {
  const Limit = pLimit(limit);
  const _promises = promises.map((p) => {
    return Limit(() => p);
  });
  const result = await Promise.all(_promises);
  return result;
};
export const getISOString = (date) => {
  if (!date) return "";
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
export const getFullUrl = (targetUrl, baseUrl) => {
  return new URL(targetUrl, baseUrl).href;
};
