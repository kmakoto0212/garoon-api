import { createBrowser } from "../src/lib/Browser";
import { login } from "../src/garoon";

(async () => {
  const auth = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  };
  const loginPage = process.env.LOGIN_PAGE;
  const browser = await createBrowser();
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "Accept-Language": "ja",
  });
  await page.goto(loginPage, {
    waitUntil: "networkidle2",
  });
  await login(page, auth);
  await page.screenshot({ path: "screenshot.png" });

  browser.close();
})();
