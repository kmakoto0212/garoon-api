import puppeteer from "puppeteer";
export declare const createBrowser: (
  obj?: puppeteer.LaunchOptions
) => Promise<puppeteer.Browser>;
