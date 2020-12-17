import { createBrowser } from "../lib/browser";
import { login } from "..";
import { auth } from "../types/auth";
import { mailProperty } from "../types/mail";
import {
  getNodeToString,
  getNodeToHref,
  getNodeToInnerText,
  createPage,
} from "../lib/page";
import { getISOString } from "../lib/utils";
import { Browser, Page } from "puppeteer";

const sendMailSelector = {
  inputTitle:
    "#body > div.mainarea > form > table > tbody > tr:nth-child(1) > td > input[type=text]",
  inputBody: "#data_editor_id",
  inputUser: "#keyword_user",
  selectUser: "#ul_selectlist_CID > li",
  addUserButton: "#btn_add_sUID",
  acknowledgment: "#\\33 _label",
  maintainer:
    "#body > div.mainarea > form > table > tbody > tr:nth-child(7) > td > label:nth-child(4)",
  submitMaintainerAll: "#btn_add_sUID_o",
  sendSubmit: "#message_button_send > a",
  draftSubmit: "#message_button_draft > a",
};

const draftMailSelector = {
  to: "#body > div.mainarea > table > tbody > tr:nth-child(1) > td > span > a",
};

const mailPropertySelector = {
  infoTableChild: "#info_area > table > tbody > tr",
  title: "#message_star_list > h2",
  from: "#info_area > table > tbody > tr:nth-child(1) > td:nth-child(3) > a",
  createdTime: "#info_area > table > tbody > tr:nth-child(1) > td:nth-child(3)",
  noChange: {
    to:
      "#info_area > table > tbody > tr:nth-child(2) > td:nth-child(3) > span > a",
  },
  change: {
    lastUpdateUser:
      "#info_area > table > tbody > tr:nth-child(2) > td:nth-child(3) > a",
    lastUpdateTime:
      "#info_area > table > tbody > tr:nth-child(2) > td:nth-child(3)",
    to:
      "#info_area > table > tbody > tr:nth-child(3) > td:nth-child(3) > span > a",
  },
  toExtra: "#display_addressee_open > span > a",
  CloseButtonImg: "#display_swith_image_close",
  text: "#info_area > div.bodytext_base_grn > div.margin_all",
};

type user = {
  userName: string;
  userUrl: string;
};

const getUsers = async (page: Page, selector: string): Promise<user[]> => {
  return await page.$$eval(selector, (users) => {
    return users.map(
      (user): user => {
        return {
          userName: user.textContent,
          userUrl: user.getAttribute("href"),
        };
      }
    );
  });
};

export const postMailMessage = async (option: {
  url: string;
  auth: auth;
  title: string;
  body: string;
  to: string[];
  acknowledgment?: boolean;
  MaintainerAll?: boolean;
  isDraft?: boolean;
  lazy?: number;
}): Promise<void> => {
  const browser = await createBrowser({
    headless: false,
    defaultViewport: { width: 0, height: 0 },
  });
  const [page] = await browser.pages();
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);

  await page.type(sendMailSelector.inputTitle, option.title);
  await page.type(sendMailSelector.inputBody, option.body);
  for (let i = 0; i < option.to.length; i++) {
    await page.evaluate(() => {
      (document.querySelector("#keyword_user") as HTMLInputElement).value = "";
    });
    const inputUser = await page.$(sendMailSelector.inputUser);
    await inputUser.type(option.to[i]);
    await inputUser.press("Enter");
    await page.waitForTimeout(option.lazy || 1000);
    await page.$$(sendMailSelector.selectUser).then((e) => {
      if (e.length) {
        e[0].click();
      } else {
        throw new Error(`${option.to[i]} is notfound...`);
      }
    });
    await page.click(sendMailSelector.addUserButton);
  }

  if (option.acknowledgment) {
    await page.click(sendMailSelector.acknowledgment);
  }
  if (option.MaintainerAll) {
    await page.click(sendMailSelector.maintainer);
    await page.click(sendMailSelector.submitMaintainerAll);
  }

  await page.waitForTimeout(1000);
  if (option.isDraft) {
    await page.click(sendMailSelector.draftSubmit);
  } else {
    await page.click(sendMailSelector.sendSubmit);
  }

  return;
};

export const getMailProperty = async (option: {
  url: string;
  auth: auth;
  browser?: Browser;
}): Promise<mailProperty> => {
  const browser: Browser = option.browser || (await createBrowser());
  const page: Page = await createPage(browser);
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);
  const href = page.url();

  const isChange =
    (await page.$$(mailPropertySelector.infoTableChild)).length > 2;
  const _selector = {
    to: isChange
      ? mailPropertySelector.change.to
      : mailPropertySelector.noChange.to,
    lastUpdateUser: mailPropertySelector.change.lastUpdateUser,
    lastUpdateTime: mailPropertySelector.change.lastUpdateTime,
  };

  const garoonGetTime = async (selector: string): Promise<string> => {
    if (!selector) return "";
    return await page.evaluate((selector: string) => {
      const node = document.querySelector(selector);
      return node.innerHTML.split("&nbsp;")[1];
    }, selector);
  };

  const mailProperty: mailProperty = {
    href,
    title: await getNodeToString(page, mailPropertySelector.title),
    from: {
      userName: await getNodeToString(page, mailPropertySelector.from),
      userUrl: await getNodeToHref(page, mailPropertySelector.from),
    },
    createdTime: await garoonGetTime(
      mailPropertySelector.createdTime
    ).then((x) => getISOString(x)),
    UpdateUser: {
      userName: await getNodeToString(page, _selector.lastUpdateUser),
      userUrl: await getNodeToHref(page, _selector.lastUpdateUser),
    },
    UpdatedTime: await garoonGetTime(_selector.lastUpdateTime).then((x) =>
      getISOString(x)
    ),
    to: (await getUsers(page, _selector.to)).concat(
      await getUsers(page, mailPropertySelector.toExtra)
    ),
    text: await getNodeToInnerText(page, mailPropertySelector.text),
  };

  if (option.browser) {
    await page.close();
  } else {
    await browser.close();
  }

  return mailProperty;
};

export const getDraftMailProperty = async (option: {
  url: string;
  auth: auth;
}): Promise<Partial<mailProperty>> => {
  const browser = await createBrowser({ headless: true });
  const [page] = await browser.pages();
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);
  const href = page.url();

  const mailProperty: Partial<mailProperty> = {
    href,
    to: await getUsers(page, draftMailSelector.to),
  };

  return mailProperty;
};
