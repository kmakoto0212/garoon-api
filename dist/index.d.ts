import { Page } from "puppeteer";
import { auth } from "./types/auth";
export declare const isLogin: (page: Page) => Promise<boolean>;
export declare const login: (page: Page, auth: auth) => Promise<void>;
