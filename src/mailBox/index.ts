import { createBrowser } from "../lib/browser";
import { login } from "..";
import { auth } from "../types/auth";
import { URL } from "url";
import { Browser } from "puppeteer";
import { mail } from "../types/mail";

const selector = {
  mailList: "td > span > a",
  mailBox: "#message_list > tbody > tr",
  moveTo: "#dcid1",
  allMailsCheckButton:
    "#view_part > div:nth-child(3) > span:nth-child(1) > button",
  moveSubmit: "#moveto",
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
    option.browser ??= browser;
    option.offset = option.offset + 30;
    mails = mails.concat(await getMails(option));
  }
  browser.close();

  return mails;
};

export const moveMails = async (option: {
  url: string;
  auth: auth;
  moveToCid: string;
  offset?: number;
  browser?: Browser;
  delay?: number;
}): Promise<void> => {
  const browser = option.browser || (await createBrowser({}));
  const [page] = await browser.pages();

  await page.goto(option.url, {
    waitUntil: "networkidle0",
  });
  if (!option.browser) await login(page, option.auth);

  while ((await page.$$(selector.mailBox)).length > 1) {
    await page.click(selector.allMailsCheckButton);
    await page.select(selector.moveTo, option.moveToCid);
    await page.click(selector.moveSubmit);
    await page.waitForTimeout(option.delay || 1000);
  }

  await browser.close();

  return;
};
