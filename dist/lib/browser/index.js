import puppeteer from "puppeteer";
export const createBrowser = (obj) => {
  const _obj = obj || {};
  _obj.args = ["--lang=ja"];
  return puppeteer.launch(_obj);
};
