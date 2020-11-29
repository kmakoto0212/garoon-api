import { Page } from "puppeteer";
import { auth } from "./types/auth";

export const login = async (page: Page, auth: auth): Promise<void> => {
  await page.type("#username-\\:0-text", auth.username);
  await page.type("#password-\\:1-text", auth.password);
  await page.click(".login-button");

  await page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
};
