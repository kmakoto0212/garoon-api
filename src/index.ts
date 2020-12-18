import { Page } from "puppeteer";
import { auth } from "./types/auth";

const loginSelector = {
  dialog: "#login-dialog",
  inputUserName: "#username-\\:0-text",
  inputPassword: "#password-\\:1-text",
  submit: ".login-button",
};

const errorSelector = {
  dialog: "body > div.error_content_grn",
};

export const isError = async (page: Page): Promise<boolean> => {
  return !!(await page.$(errorSelector.dialog));
};

export const isLogin = async (page: Page): Promise<boolean> => {
  return !(await page.$(loginSelector.dialog));
};

export const login = async (page: Page, auth: auth): Promise<void> => {
  if (await isLogin(page)) return;

  await page.type(loginSelector.inputUserName, auth.username);
  await page.type(loginSelector.inputPassword, auth.password);
  await page.click(loginSelector.submit);

  await page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
};
