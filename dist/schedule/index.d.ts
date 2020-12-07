import { auth } from "../types/auth";
import { Browser } from "puppeteer";
export declare const getUsersUrl: (option: {
  url: string;
  auth: auth;
  offset?: number;
  browser?: Browser;
}) => Promise<string[]>;
