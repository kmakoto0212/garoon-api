import { auth } from "../types/auth";
import { user } from "../types/user";
import { Browser } from "puppeteer";
export declare const getProfile: (option: {
  url: string;
  auth: auth;
  browser?: Browser;
}) => Promise<user<string>>;
