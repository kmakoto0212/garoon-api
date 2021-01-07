import { Auth } from "../types/auth";
import { Address } from "../types/mail";
import { Browser } from "puppeteer";
export declare const sendMail: (option: {
  url: string;
  auth: Auth;
  browser?: Browser;
  title?: string;
  body?: string;
  to: Address[];
  CC?: Address[];
  BCC?: Address[];
  isDraft?: boolean;
  uploadFiles?: string[];
  delay?: number;
}) => Promise<void>;
