import { createBrowser } from "../lib/browser";
import { login, isError } from "..";
import {
  getNodeToString,
  getNodeToHref,
  getNodeToInnerText,
  createPage,
  downLoadFile,
} from "../lib/page";
import { getISOString, getFullUrl } from "../lib/utils";
const sendMessagePageSelector = {
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
const draftMessagePageSelector = {
  to: "#body > div.mainarea > table > tbody > tr:nth-child(1) > td > span",
};
const messagePageSelector = {
  infoTableChild: "#info_area > table > tbody > tr",
  unread: "#info_area > div.unread_color",
  title: "#message_star_list > h2",
  from: "#info_area > table > tbody > tr:nth-child(1) > td:nth-child(3)",
  createdTime: "#info_area > table > tbody > tr:nth-child(1) > td:nth-child(3)",
  noChange: {
    to: "#info_area > table > tbody > tr:nth-child(2) > td:nth-child(3) > span",
  },
  change: {
    lastUpdateUser:
      "#info_area > table > tbody > tr:nth-child(2) > td:nth-child(3) > a",
    lastUpdateTime:
      "#info_area > table > tbody > tr:nth-child(2) > td:nth-child(3)",
    to: "#info_area > table > tbody > tr:nth-child(3) > td:nth-child(3) > span",
  },
  toExtra: "#display_addressee_open > span",
  CloseButtonImg: "#display_swith_image_close",
  text: {
    read: "#info_area > div.bodytext_base_grn > div.margin_all",
    unread: "#info_area > div.unread_color > div",
  },
  attachments: "#info_area > div.bodytext_base_grn > p > tt > a",
};
const getUser = async (elem) => {
  const link = await elem.$("a");
  if (link) {
    return {
      userName: await link.evaluate((x) => x.textContent),
      userUrl: await link.evaluate((x) => x.getAttribute("href")),
    };
  } else {
    return {
      userName: await elem.$eval("span", (x) => x.textContent),
      userUrl: "",
    };
  }
};
const getUsers = async (page, selector) => {
  const users = await page.$$(selector);
  return (
    await Promise.all(users.map(async (user) => await getUser(user)))
  ).filter((user) => !/^javascript:/.test(user.userUrl));
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
  await page.type(sendMessagePageSelector.inputTitle, option.title);
  await page.type(sendMessagePageSelector.inputBody, option.body);
  for (let i = 0; i < option.to.length; i++) {
    await page.evaluate(() => {
      document.querySelector("#keyword_user").value = "";
    });
    const inputUser = await page.$(sendMessagePageSelector.inputUser);
    await inputUser.type(option.to[i]);
    await inputUser.press("Enter");
    await page.waitForTimeout(option.lazy || 1000);
    await page.$$(sendMessagePageSelector.selectUser).then((e) => {
      if (e.length) {
        e[0].click();
      } else {
        throw new Error(`${option.to[i]} is notfound...`);
      }
    });
    await page.click(sendMessagePageSelector.addUserButton);
  }
  if (option.acknowledgment) {
    await page.click(sendMessagePageSelector.acknowledgment);
  }
  if (option.MaintainerAll) {
    await page.click(sendMessagePageSelector.maintainer);
    await page.click(sendMessagePageSelector.submitMaintainerAll);
  }
  await page.waitForTimeout(1000);
  if (option.isDraft) {
    await page.click(sendMessagePageSelector.draftSubmit);
  } else {
    await page.click(sendMessagePageSelector.sendSubmit);
  }
  return;
};
export const downLoadMailFiles = async (option) => {
  const browser = option.browser || (await createBrowser());
  const page = await createPage(browser);
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);
  const attachments = await getFiles(
    page,
    messagePageSelector.attachments,
    option.url
  ).then((files) => {
    return files.filter(({ fileName }) => {
      return !/\[.*\]/.test(fileName); //not attachments is ignore.
    });
  });
  await Promise.all(
    attachments.map(async (file, index) => {
      await downLoadFile(
        page,
        (await page.$$(messagePageSelector.attachments)).filter((node) =>
          node.evaluate((x) => !/\[.*\]/.test(x.textContent))
        )[index],
        option.dirName + "/" + file.fileName
      );
    })
  );
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
    (await page.$$(messagePageSelector.infoTableChild)).length > 2;
  const isUnRead = !!(await page.$(messagePageSelector.unread));
  const _selector = {
    to: isChange
      ? messagePageSelector.change.to
      : messagePageSelector.noChange.to,
    lastUpdateUser: messagePageSelector.change.lastUpdateUser,
    lastUpdateTime: messagePageSelector.change.lastUpdateTime,
    text: isUnRead
      ? messagePageSelector.text.unread
      : messagePageSelector.text.read,
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
    title: await getNodeToString(page, messagePageSelector.title),
    from: await getUser(await page.$(messagePageSelector.from)),
    createdTime: await garoonGetTime(
      messagePageSelector.createdTime
    ).then((x) => getISOString(x)),
    UpdateUser: {
      userName: await getNodeToString(page, _selector.lastUpdateUser),
      userUrl: await getNodeToHref(page, _selector.lastUpdateUser),
    },
    UpdatedTime: await garoonGetTime(_selector.lastUpdateTime).then((x) =>
      getISOString(x)
    ),
    to: (await getUsers(page, _selector.to)).concat(
      await getUsers(page, messagePageSelector.toExtra)
    ),
    text: await getNodeToInnerText(page, _selector.text),
    attachments: await getFiles(
      page,
      messagePageSelector.attachments,
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
    to: await getUsers(page, draftMessagePageSelector.to),
  };
  return mailProperty;
};
