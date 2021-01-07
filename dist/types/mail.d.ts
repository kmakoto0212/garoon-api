export declare type Mail = {
  title: string;
  url: string;
};
export declare type User = {
  userName: string;
  userUrl: string;
};
export declare type File = {
  fileName: string;
  fileUrl: string;
};
export declare type Address = {
  name: string;
  address: string;
};
export declare type MailProperty = {
  href: string;
  title: string;
  from: User;
  createdTime: string;
  UpdateUser: User;
  UpdatedTime: string;
  to: User[];
  text: string;
  attachments: File[] | "";
};
