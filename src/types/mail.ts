export type Mail = {
  title: string;
  url: string;
};

export type User = {
  userName: string;
  userUrl: string;
};

export type File = {
  fileName: string;
  fileUrl: string;
};

export type Address = {
  name: string;
  address: string;
};

export type MailProperty = {
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
