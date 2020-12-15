export type mail = {
  title: string;
  url: string;
};

export type mailProperty = {
  href: string;
  title: string;
  from: {
    userName: string;
    userURL: string;
  };
  createdTime?: string;
  UpdatedTime?: string;
  to: {
    userNames: string[];
    userURLs: string[];
  };
  text: string;
};
