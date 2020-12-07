import { Browser, Page } from "puppeteer";
import { login } from "../garoon";
import { auth } from "../types/auth";

export const createPage = async (
  browser: Browser,
  option?: {
    noImages?: boolean;
    preLogin?: {
      url: string;
      auth: auth;
    };
  }
): Promise<Page> => {
  const page = await browser.newPage();
  option ??= {};
  option.noImages ??= true;
  if (option.noImages) {
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (
        ["image", "stylesheet", "font"].indexOf(request.resourceType()) !== -1
      ) {
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
