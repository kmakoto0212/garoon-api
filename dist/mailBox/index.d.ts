import { Auth } from "../types/auth";
import { Browser } from "puppeteer";
import { Mail } from "../types/mail";
export declare const getMails: (option: {
  url: string;
  auth: Auth;
  offset?: number;
  browser?: Browser;
}) => Promise<Mail[]>;
export declare const moveMails: (option: {
  url: string;
  auth: Auth;
  moveToCid: string;
  offset?: number;
  browser?: Browser;
  delay?: number;
}) => Promise<void>;
