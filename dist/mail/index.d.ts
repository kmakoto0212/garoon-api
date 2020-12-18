import { Auth } from "../types/auth";
import { MailProperty } from "../types/mail";
import { Browser } from "puppeteer";
export declare const postMailMessage: (option: {
  url: string;
  auth: Auth;
  title: string;
  body: string;
  to: string[];
  acknowledgment?: boolean;
  MaintainerAll?: boolean;
  isDraft?: boolean;
  lazy?: number;
}) => Promise<void>;
export declare const getMailProperty: (option: {
  url: string;
  auth: Auth;
  browser?: Browser;
}) => Promise<MailProperty>;
export declare const getDraftMailProperty: (option: {
  url: string;
  auth: Auth;
}) => Promise<Partial<MailProperty>>;
