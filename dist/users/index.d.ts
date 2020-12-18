import { Auth } from "../types/auth";
import { User } from "../types/user";
import { Browser } from "puppeteer";
export declare const getProfile: (option: {
  url: string;
  auth: Auth;
  browser?: Browser;
}) => Promise<User>;
