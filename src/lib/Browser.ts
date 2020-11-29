import * as puppeteer from "puppeteer";

export const createBrowser = (
  obj?: puppeteer.LaunchOptions
): Promise<puppeteer.Browser> => {
  const _obj = obj || {};
  _obj.args = ["--lang=ja"];
  return puppeteer.launch(_obj);
};
