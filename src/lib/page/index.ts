import { Browser, Cookie, Page, Request, ElementHandle } from "puppeteer";
import { promises as fsp } from "fs";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { login } from "../..";
import { Auth } from "../../types/auth";

export const createPage = async (
  browser: Browser,
  option?: {
    noImages?: boolean;
    preLogin?: {
      url: string;
      auth: Auth;
    };
  }
): Promise<Page> => {
  const page = await browser.newPage();
  option ??= {};
  option.noImages ??= true;
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

export const getNodeToString = async (
  page: Page,
  selector: string
): Promise<string> => {
  return page
    .$eval(selector, (e) => {
      return e?.textContent;
    })
    .catch(() => "");
};

export const getNodeToHref = async (
  page: Page,
  selector: string
): Promise<string> => {
  return page
    .$eval(selector, (e) => {
      return e?.getAttribute("href");
    })
    .catch(() => "");
};

export const getNodesToStringsArray = async (
  page: Page,
  selector: string
): Promise<string[]> => {
  return page
    .$$eval(selector, (e) => {
      return e?.map((e) => {
        return e.textContent;
      });
    })
    .catch(() => []);
};

export const getNodesToHrefArray = async (
  page: Page,
  selector: string
): Promise<string[]> => {
  return page
    .$$eval(selector, (e) => {
      return e?.map((e) => {
        return e.getAttribute("href");
      });
    })
    .catch(() => []);
};

export const getNodeToInnerText = async (
  page: Page,
  selector: string
): Promise<string> => {
  return await page.$eval(selector, (node) => (node as HTMLElement).innerText);
};

const sendRequest = async (
  request: Request,
  cookies: Cookie[]
): Promise<AxiosResponse> => {
  const options: AxiosRequestConfig = {
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

export const downLoadFile = async (
  page: Page,
  src: ElementHandle<Element>,
  saveFileFullPath: string
): Promise<void> => {
  console.log(await src.evaluate((x) => x.textContent));
  const _download = async (request: Request) => {
    const response = await sendRequest(request, await page.cookies());
    await fsp.writeFile(saveFileFullPath, response.data);
  };

  page.on("request", _download);
  await src.click();
  await page.waitForTimeout(1000);
};
