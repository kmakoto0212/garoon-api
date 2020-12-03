import { createBrowser } from "./lib/Browser";
import { login } from "./garoon";
import { auth } from "./types/auth";
import { URL } from "url";
import { Browser } from "puppeteer";
import { mail } from "./types/mail";

const selector = {
  mailList: "td > span > a",
};

export const getMails = async (option: {
  url: string;
  auth: auth;
  offset?: number;
  browser?: Browser;
}): Promise<mail[]> => {
  option.offset ??= 0;
  const browser = option.browser || (await createBrowser());
  const [page] = await browser.pages();
  const _url = new URL(option.url);
  _url.searchParams.append("sp", option.offset.toString());

  await page.goto(_url.href, {
    waitUntil: "domcontentloaded",
  });
  page.waitForTimeout(1000);
  if (!option.browser) await login(page, option.auth);
  let mails = await page.$$eval(selector.mailList, (nodes) => {
    return nodes
      ?.map(
        (mail): mail => {
          return {
            title: mail.textContent,
            url: new URL(mail.getAttribute("href"), option.url).href,
          };
        }
      )
      .filter(({ url }) => {
        return /mid=/.test(url);
      });
  });

  if (mails.length > 29) {
    option.browser ??= browser;
    option.offset = option.offset + 30;
    mails = mails.concat(await getMails(option));
  }
  browser.close();

  return mails;
};
