import { auth } from "../types/auth";
import { Browser } from "puppeteer";
import { mail } from "../types/mail";
export declare const getMails: (option: {
  url: string;
  auth: auth;
  offset?: number;
  browser?: Browser;
}) => Promise<mail[]>;
