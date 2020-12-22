import { createBrowser } from "../lib/browser";
import { createPage } from "../lib/page";
import { login } from "..";
import { Auth } from "../types/auth";
import { Browser, Page } from "puppeteer";
const sendMailSelector = {
  inputTitle: "#subject_mail",
  inputBody: "#data_editor_id",
  inputTo: "#selectTo_annoninput > input",
  inputCC: "#selectCC_annoninput > input",
  openBCC: "#add_bcc_mail > td:nth-child(2) > a",
  inputBCC: "#selectBCC_annoninput > input",
  submitMaintainerAll: "#btn_add_sUID_o",
  sendSubmit: "#mail_button_send_top > a",
  sendSubmit2: "#mail_button_send > a",
  draftSubmit: "#mail_button_save_top > a",
  uploader: "#file_upload_",
};

export const sendMail = async (option: {
  url: string;
  auth: Auth;
  browser?: Browser;
  title: string;
  body: string;
  to: string[];
  CC: string[];
  BCC: string[];
  isDraft?: boolean;
  uploadFiles: string[];
}): Promise<void> => {
  const browser: Browser = option.browser || (await createBrowser());
  const page: Page = await createPage(browser);
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);

  await page.type(sendMailSelector.inputTitle, option.title);
  await page.type(sendMailSelector.inputTo, option.to.join(","));
  await page.type(sendMailSelector.inputCC, option.CC.join(","));
  await page.click(sendMailSelector.openBCC);
  await page.type(sendMailSelector.inputBCC, option.BCC.join(","));
  await page.type(sendMailSelector.inputBody, option.body);

  if (option.uploadFiles) {
    const uploader = await page.$(sendMailSelector.uploader);
    await uploader.uploadFile(...option.uploadFiles);
  }

  await page.waitForTimeout(1000);
  if (option.isDraft) {
    await page.click(sendMailSelector.draftSubmit);
  } else {
    await page.click(sendMailSelector.sendSubmit);
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.click(sendMailSelector.sendSubmit2);
  }

  if (option.browser) {
    await page.close();
  } else {
    await browser.close();
  }

  return;
};
