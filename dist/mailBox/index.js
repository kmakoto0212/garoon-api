import { createBrowser } from "../lib/browser";
import { login } from "..";
import { URL } from "url";
import { getFullUrl } from "../lib/utils";
import { createPage } from "../lib/page";
const mailBoxPageSelector = {
  mailList: "td > span > a",
  mail: "#message_list > tbody > tr",
  moveTo: "#dcid1",
  allMailsCheckButton:
    "#view_part > div:nth-child(3) > span:nth-child(1) > button",
  moveSubmit: "#moveto",
};
export const getMails = async (option) => {
  var _a, _b;
  (_a = option.offset) !== null && _a !== void 0 ? _a : (option.offset = 0);
  const browser = option.browser || (await createBrowser());
  const page = await createPage(browser);
  const _url = new URL(option.url);
  _url.searchParams.append("sp", option.offset.toString());
  await page.goto(_url.href, {
    waitUntil: "domcontentloaded",
  });
  page.waitForTimeout(1000);
  if (!option.browser) await login(page, option.auth);
  const mailsNode = await page.$$(mailBoxPageSelector.mailList);
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
        url: getFullUrl(mail.url, option.url),
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
  if (option.browser) {
    await page.close();
  } else {
    await browser.close();
  }
  return mails;
};
export const moveMails = async (option) => {
  const browser = option.browser || (await createBrowser({}));
  const page = await createPage(browser);
  await page.goto(option.url, {
    waitUntil: "networkidle0",
  });
  await login(page, option.auth);
  while ((await page.$$(mailBoxPageSelector.mail)).length > 1) {
    await page.click(mailBoxPageSelector.allMailsCheckButton);
    await page.select(mailBoxPageSelector.moveTo, option.moveToCid);
    await page.click(mailBoxPageSelector.moveSubmit);
    await page.waitForTimeout(option.delay || 1000);
  }
  if (option.browser) {
    await page.close();
  } else {
    await browser.close();
  }
  return;
};
