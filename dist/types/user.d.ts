export declare type User = {
  url: string;
  about: string | null;
  basicProfile: {
    displayName: string | null;
    name: {
      surName: string | null;
      givenName: string | null;
    };
    yomigana?: {
      surNameReading: string | null;
      givenNameReading: string | null;
    };
    departments: string[];
    priorityDepartment: string | null;
    birthday: string | null;
    hireDate: string | null;
    employeeID: string | null;
    timeZone: string | null;
    language: string | null;
  };
  contacts: {
    "e-mailAddress": string | null;
  };
  contactDetails?: {
    "e-mailAddress": string | null;
    MobilePhone: string | null;
    Phone: string | null;
    Extension: string | null;
    skypeName: string | null;
  };
  Others?: {
    localizedName: string | null;
    URL: string | null;
    ServicesInUses: string[];
  };
};
