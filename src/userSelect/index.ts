import { createBrowser } from "../lib/browser";
import { login } from "..";
import { Auth } from "../types/auth";
import { URL } from "url";
import { Browser } from "puppeteer";

export const getUsersValues = async (option: {
  url: string;
  auth: Auth;
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
  const options = await page.$$("#c_id > option");
  const users: string[] = await Promise.all(
    options.map(async (x) => {
      return await x.evaluate((x) => {
        return x.textContent;
      });
    })
  );
  await page.screenshot({
    path: "./screenshot.png",
    fullPage: true,
  });
  browser.close();

  return users;
};
