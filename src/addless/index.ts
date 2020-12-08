import { createBrowser } from "../lib/browser";
import { login } from "..";
import { auth } from "../types/auth";
import { URL } from "url";
import { Browser } from "puppeteer";

export const getUsersUrl = async (option: {
  url: string;
  auth: auth;
  offset?: number;
  browser?: Browser;
}): Promise<string[]> => {
  option.offset ??= 0;
  const browser = option.browser || (await createBrowser());
  const [page] = await browser.pages();
  const _url = new URL(option.url);
  _url.searchParams.append("sp", option.offset.toString());

  await page.goto(_url.href, {
    waitUntil: "networkidle2",
  });
  if (!option.browser) await login(page, option.auth);
  let hrefs = await page.$$eval(
    "#userlist_address_book > table > tbody > tr > td > a",
    (elems) => elems.map((elem) => elem.getAttribute("href"))
  );
  await page.screenshot({
    path: "./screenshot.png",
    fullPage: true,
  });
  if (hrefs.length >= 29) {
    option.browser ??= browser;
    option.offset = option.offset + 30;
    hrefs = hrefs.concat(await getUsersUrl(option));
  }
  browser.close();

  return hrefs;
};
