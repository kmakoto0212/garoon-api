import { Browser, Page } from "puppeteer";
import { Auth } from "../../types/auth";
export declare const createPage: (
  browser: Browser,
  option?: {
    noImages?: boolean;
    preLogin?: {
      url: string;
      auth: Auth;
    };
  }
) => Promise<Page>;
export declare const getNodeToString: (
  page: Page,
  selector: string
) => Promise<string>;
export declare const getNodeToHref: (
  page: Page,
  selector: string
) => Promise<string>;
export declare const getNodesToStringsArray: (
  page: Page,
  selector: string
) => Promise<string[]>;
export declare const getNodesToHrefArray: (
  page: Page,
  selector: string
) => Promise<string[]>;
export declare const getNodeToInnerText: (
  page: Page,
  selector: string
) => Promise<string>;
