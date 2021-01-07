import { createBrowser } from "../lib/browser";
import { login } from "..";
import { URL } from "url";
export const getUsersValues = async (option) => {
  var _a;
  (_a = option.offset) !== null && _a !== void 0 ? _a : (option.offset = 0);
  const browser = option.browser || (await createBrowser());
  const [page] = await browser.pages();
  const _url = new URL(option.url);
  _url.searchParams.append("sp", option.offset.toString());
  await page.goto(_url.href, {
    waitUntil: "networkidle2",
  });
  if (!option.browser) await login(page, option.auth);
  const options = await page.$$("#c_id > option");
  const users = await Promise.all(
    options.map(async (x) => {
      return await x.evaluate((x) => {
        return x.textContent;
      });
    })
  );
  browser.close();
  return users;
};
