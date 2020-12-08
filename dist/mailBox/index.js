import { createBrowser } from "../lib/browser";
import { login } from "..";
import { URL } from "url";
const selector = {
  mailList: "td > span > a",
};
export const getMails = async (option) => {
  var _a, _b;
  (_a = option.offset) !== null && _a !== void 0 ? _a : (option.offset = 0);
  const browser = option.browser || (await createBrowser());
  const [page] = await browser.pages();
  const _url = new URL(option.url);
  _url.searchParams.append("sp", option.offset.toString());
  await page.goto(_url.href, {
    waitUntil: "domcontentloaded",
  });
  page.waitForTimeout(1000);
  if (!option.browser) await login(page, option.auth);
  const mailsNode = await page.$$(selector.mailList);
  let mails = (
    await Promise.all(
      mailsNode.map(async (mail) => {
        return await mail.evaluate((mail) => {
          return {
            title: mail.textContent,
            url: mail.getAttribute("href"),
          };
        });
      })
    )
  )
    .filter(({ url }) => {
      return /mid=/.test(url);
    })
    .map((mail) => {
      return (mail = {
        url: new URL(mail.url, option.url).href,
        title: mail.title,
      });
    });
  if (mails.length > 29) {
    (_b = option.browser) !== null && _b !== void 0
      ? _b
      : (option.browser = browser);
    option.offset = option.offset + 30;
    mails = mails.concat(await getMails(option));
  }
  browser.close();
  return mails;
};
