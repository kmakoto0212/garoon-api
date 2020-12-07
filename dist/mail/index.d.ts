import { auth } from "../types/auth";
import { mailProperty } from "../types/mail";
export declare const postMailMessage: (option: {
  url: string;
  auth: auth;
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
  auth: auth;
}) => Promise<mailProperty>;
