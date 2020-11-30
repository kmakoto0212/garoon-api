export type user = {
  about: string;
  basicProfile: {
    displayName: string;
    name: string;
    departments: string[];
    priorityDepartment: string;
    birthday: string;
    hireDate: string;
    employeeID: string;
    timeZone: string;
    language: string;
  };
  contactDetails: {
    "e-mailAddress": string;
    MobilePhone: string;
    Phone: string;
    Extension: string;
    skypeName: string;
  };
  Others: {
    localizedName: string;
    URL: string;
    ServicesInUses: string[];
  };
};
