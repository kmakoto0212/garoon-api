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
