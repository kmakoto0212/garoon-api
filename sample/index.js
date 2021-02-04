import { createBrowser } from "../src/lib/Browser";
import { login } from "../src";

(async () => {
  const auth = {
    username: process.env.GAROON_USERNAME,
    password: process.env.GAROON_PASSWORD,
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
})()
  .then(() => {
    console.log("ok");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
