import { Page } from "puppeteer";
import { Auth } from "./types/auth";
export declare const isError: (page: Page) => Promise<boolean>;
export declare const isLogin: (page: Page) => Promise<boolean>;
export declare const login: (page: Page, auth: Auth) => Promise<void>;
