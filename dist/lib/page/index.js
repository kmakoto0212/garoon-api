import { promises as fsp } from "fs";
import axios from "axios";
import { login } from "../..";
export const createPage = async (browser, option) => {
  var _a;
  const page = await browser.newPage();
  option !== null && option !== void 0 ? option : (option = {});
  (_a = option.noImages) !== null && _a !== void 0
    ? _a
    : (option.noImages = true);
  if (option.noImages) {
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }
  if (option.preLogin) {
    await page.goto(option.preLogin.url, {
      waitUntil: "networkidle0",
    });
    await login(page, option.preLogin.auth);
  }
  return page;
};
export const getNodeToString = async (page, selector) => {
  return page
    .$eval(selector, (e) => {
      return e === null || e === void 0 ? void 0 : e.textContent;
    })
    .catch(() => "");
};
export const getNodeToHref = async (page, selector) => {
  return page
    .$eval(selector, (e) => {
      return e === null || e === void 0 ? void 0 : e.getAttribute("href");
    })
    .catch(() => "");
};
export const getNodesToStringsArray = async (page, selector) => {
  return page
    .$$eval(selector, (e) => {
      return e === null || e === void 0
        ? void 0
        : e.map((e) => {
            return e.textContent;
          });
    })
    .catch(() => []);
};
export const getNodesToHrefArray = async (page, selector) => {
  return page
    .$$eval(selector, (e) => {
      return e === null || e === void 0
        ? void 0
        : e.map((e) => {
            return e.getAttribute("href");
          });
    })
    .catch(() => []);
};
export const getNodeToInnerText = async (page, selector) => {
  return await page.$eval(selector, (node) => node.innerText);
};
const sendRequest = async (request, cookies) => {
  const options = {
    method: request.method(),
    url: request.url(),
    data: request.postData(),
    headers: request.headers(),
  };
  options.headers.Cookie = cookies
    .map((cookie) => cookie.name + "=" + cookie.value)
    .join(";");
  return await axios.request(options);
};
export const downLoadFile = async (page, src, saveFileFullPath) => {
  console.log(await src.evaluate((x) => x.textContent));
  const _download = async (request) => {
    const response = await sendRequest(request, await page.cookies());
    await fsp.writeFile(saveFileFullPath, response.data);
  };
  page.on("request", _download);
  await src.click();
  await page.waitForTimeout(1000);
};
