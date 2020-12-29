import { createBrowser } from "../lib/browser";
import { createPage } from "../lib/page";
import { login } from "..";
import { Auth } from "../types/auth";
import { Address } from "../types/mail";
import { Browser, Page } from "puppeteer";

const sendMailPageSelector = {
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
  uploadFiles: 'input[name="upload_fileids[]"]',
};

const toAddress = (address: Address): string => {
  if (!address.name) return address.address;
  return `"${address.name}" <${address.address}>`;
};

export const sendMail = async (option: {
  url: string;
  auth: Auth;
  browser?: Browser;
  title?: string;
  body?: string;
  to: Address[];
  CC?: Address[];
  BCC?: Address[];
  isDraft?: boolean;
  uploadFiles?: string[];
  delay?: number;
}): Promise<void> => {
  const browser: Browser = option.browser || (await createBrowser());
  const page: Page = await createPage(browser);
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);

  await page.type(sendMailPageSelector.inputTitle, option.title);
  await page.type(
    sendMailPageSelector.inputTo,
    option.to.map(toAddress).join(",")
  );
  if (option.CC) {
    await page.type(
      sendMailPageSelector.inputCC,
      option.CC.map(toAddress).join(",")
    );
  }
  if (option.BCC) {
    await page.click(sendMailPageSelector.openBCC);
    await page.type(
      sendMailPageSelector.inputBCC,
      option.BCC.map(toAddress).join(",")
    );
  }
  if (option.body) {
    await page.type(sendMailPageSelector.inputBody, option.body);
  }

  if (option.uploadFiles) {
    const uploader = await page.$(sendMailPageSelector.uploader);
    await uploader.uploadFile(...option.uploadFiles);
    await page.waitForFunction(
      (selector, filesNum) => {
        return document.querySelectorAll(selector).length === filesNum;
      },
      {
        polling: "raf",
        timeout: 0,
      },
      sendMailPageSelector.uploadFiles,
      option.uploadFiles.length
    );
  }

  await page.waitForTimeout(option.delay || 1000);
  if (option.isDraft) {
    await page.click(sendMailPageSelector.draftSubmit);
  } else {
    await page.click(sendMailPageSelector.sendSubmit);
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.click(sendMailPageSelector.sendSubmit2);
  }

  await page.waitForNavigation({ waitUntil: "networkidle2" });
  if (option.browser) {
    await page.close();
  } else {
    await browser.close();
  }

  return;
};
