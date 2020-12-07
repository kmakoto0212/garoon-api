export type user<T> = {
  about: T | null;
  basicProfile: {
    displayName: T | null;
    name: {
      surName: T | null;
      givenName: T | null;
    };
    yomigana?: {
      surNameReading: T | null;
      givenNameReading: T | null;
    };
    departments: T[];
    priorityDepartment: T | null;
    birthday: T | null;
    hireDate: T | null;
    employeeID: T | null;
    timeZone: T | null;
    language: T | null;
  };
  contactDetails?: {
    "e-mailAddress": T | null;
    MobilePhone: T | null;
    Phone: T | null;
    Extension: T | null;
    skypeName: T | null;
  };
  Others?: {
    localizedName: T | null;
    URL: T | null;
    ServicesInUses: T[];
  };
};
