import { createBrowser } from "../lib/browser";
import { login } from "..";
import { URL } from "url";
export const getUsersUrl = async (option) => {
  var _a, _b;
  (_a = option.offset) !== null && _a !== void 0 ? _a : (option.offset = 0);
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
    (_b = option.browser) !== null && _b !== void 0
      ? _b
      : (option.browser = browser);
    option.offset = option.offset + 30;
    hrefs = hrefs.concat(await getUsersUrl(option));
  }
  browser.close();
  return hrefs;
};
