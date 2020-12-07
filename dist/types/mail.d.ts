export declare type mail = {
  title: string;
  url: string;
};
export declare type mailProperty = {
  href: string;
  title: string;
  from: {
    userName: string;
    userURL: string;
  };
  createdTime?: Date;
  UpdatedTime?: Date;
  to: {
    userNames: string[];
    userURLs: string[];
  };
  text: string;
};
