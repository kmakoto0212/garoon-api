import { Auth } from "../types/auth";
import { Browser } from "puppeteer";
export declare const getUsersValues: (option: {
  url: string;
  auth: Auth;
  offset?: number;
  browser?: Browser;
}) => Promise<string[]>;
