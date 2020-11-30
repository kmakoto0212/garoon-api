import { createBrowser } from "./lib/Browser";
import { login } from "./garoon";
import { auth } from "./types/auth";

export const getProfile = async (option: {
  url: string;
  auth: auth;
}): Promise<string[]> => {
  const browser = await createBrowser();
  const page = await browser.newPage();
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);
  const hrefs = await page.$$eval(
    ".profileImageBaseSchedule-grn > dl > dd > a",
    (elems) => elems.map((elem) => elem.getAttribute("href"))
  );
  browser.close();

  return hrefs;
};
