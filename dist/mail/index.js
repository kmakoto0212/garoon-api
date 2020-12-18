import { createBrowser } from "../lib/browser";
import { login, isError } from "..";
import {
  getNodeToString,
  getNodeToHref,
  getNodeToInnerText,
  createPage,
} from "../lib/page";
import { getISOString, getFullUrl } from "../lib/utils";
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
  attachments: "#info_area > div.bodytext_base_grn > p > tt > a",
};
const getUsers = async (page, selector) => {
  return await page.$$eval(selector, (users) => {
    return users.map((user) => {
      return {
        userName: user.textContent,
        userUrl: user.getAttribute("href"),
      };
    });
  });
};
const getFiles = async (page, selector, baseUrl) => {
  return await page
    .$$eval(selector, (files) => {
      return files.map((file) => {
        return {
          fileName: file.textContent,
          fileUrl: file.getAttribute("href"),
        };
      });
    })
    .then((files) => {
      return files.map(({ fileName, fileUrl }) => {
        return {
          fileName: fileName || /message\/(.*)\?/.exec(fileUrl)[1],
          fileUrl: getFullUrl(fileUrl, baseUrl),
        };
      });
    });
};
export const postMailMessage = async (option) => {
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
      document.querySelector("#keyword_user").value = "";
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
export const getMailProperty = async (option) => {
  const browser = option.browser || (await createBrowser());
  const page = await createPage(browser);
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);
  if (await isError(page)) {
    if (option.browser) {
      await page.close();
    } else {
      await browser.close();
    }
    throw new Error(`"${option.url}" is an invalid URL.`);
  }
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
  const garoonGetTime = async (selector) => {
    if (!selector) return "";
    return await page.evaluate((selector) => {
      const node = document.querySelector(selector);
      return node.innerHTML.split("&nbsp;")[1];
    }, selector);
  };
  const mailProperty = {
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
    attachments: await getFiles(
      page,
      mailPropertySelector.attachments,
      option.url
    ).then((files) => {
      return files.filter(({ fileName }) => {
        return !/\[.*\]/.test(fileName); //not attachments is ignore.
      });
    }),
  };
  if (option.browser) {
    await page.close();
  } else {
    await browser.close();
  }
  return mailProperty;
};
export const getDraftMailProperty = async (option) => {
  const browser = await createBrowser({ headless: true });
  const [page] = await browser.pages();
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);
  const href = page.url();
  const mailProperty = {
    href,
    to: await getUsers(page, draftMailSelector.to),
  };
  return mailProperty;
};
