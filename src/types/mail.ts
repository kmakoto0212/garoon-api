export type mail = {
  title: string;
  url: string;
};

type user = {
  userName: string;
  userUrl: string;
};

export type mailProperty = {
  href: string;
  title: string;
  from: user;
  createdTime?: string;
  UpdatedTime?: string;
  to: user[];
  text: string;
};
