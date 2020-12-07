import { createBrowser } from "../lib/browser";
import { login } from "..";
import {
  getNodeToString,
  getNodesToStringsArray,
  getNodeToHref,
  getNodesToHrefArray,
  getNodeToInnerText,
} from "../lib/page";
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
const mailPropertySelector = {
  infoTableChild: "#info_area > table > tr",
  title: "#message_star_list > h2",
  from: "#info_area > table > tbody > tr:nth-child(1) > td:nth-child(3) > a",
  noChange: {
    to:
      "#info_area > table > tbody > tr:nth-child(2) > td:nth-child(3) > span > a",
    showButton: "#display_addressee_close > span > small > a",
  },
  change: {
    lastUpdateUser:
      "#info_area > table > tbody > tr:nth-child(2) > td:nth-child(3) > a",
    to:
      "#info_area > table > tbody > tr:nth-child(3) > td:nth-child(3) > span > a",
    showButton:
      "#info_area > table > tbody > tr:nth-child(3) > td:nth-child(1) > a",
  },
  toExtra: "#display_addressee_open > span > a",
  CloseButtonImg: "#display_swith_image_close",
  text: "#info_area > div.bodytext_base_grn > div > pre",
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
  const browser = await createBrowser({ headless: true });
  const [page] = await browser.pages();
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
    lastUpdateUser: isChange ? mailPropertySelector.change.lastUpdateUser : "",
    showButton: isChange
      ? mailPropertySelector.change.showButton
      : mailPropertySelector.noChange.showButton,
  };
  const mailProperty = {
    href,
    title: await getNodeToString(page, mailPropertySelector.title),
    from: {
      userName: await getNodeToString(page, mailPropertySelector.from),
      userURL: await getNodeToHref(page, mailPropertySelector.from),
    },
    to: {
      userNames: (await getNodesToStringsArray(page, _selector.to)).concat(
        await getNodesToStringsArray(page, mailPropertySelector.toExtra)
      ),
      userURLs: (await getNodesToHrefArray(page, _selector.to)).concat(
        await getNodesToHrefArray(page, mailPropertySelector.toExtra)
      ),
    },
    text: await getNodeToInnerText(page, mailPropertySelector.text),
  };
  await browser.close();
  return mailProperty;
};
