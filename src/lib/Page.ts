import { Page } from "puppeteer";

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
