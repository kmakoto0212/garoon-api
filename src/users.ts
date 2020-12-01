import { createBrowser } from "./lib/Browser";
import { login } from "./garoon";
import { auth } from "./types/auth";
import { user } from "./types/user";
import { ElementHandle } from "puppeteer";

const selector = {
  about:
    "#js-settings-content > div.b-settings-profile-comment > div > div.b-form-form.b-form-edittoggleform.is-readonly > div.is-readonly > div > div > span > span",
  basicProfile: {
    displayName:
      "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(1) > dd > div > div > span",
    name: {
      givenName:
        "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl.b-form-row-labeledpair.is-readonly > dd > div.b-form-input-forminput.b-form-input-forminput-inputname-givenName > div > span",
      surName:
        "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl.b-form-row-labeledpair.is-readonly > dd > div.b-form-input-forminput.b-form-input-forminput-inputname-surName > div > span",
    },
    yomigana: {
      surNameReading:
        "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(3) > dd > div.b-form-input-forminput.b-form-input-forminput-inputname-surNameReading > div > span",
      givenNameReading:
        "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(3) > dd > div.b-form-input-forminput.b-form-input-forminput-inputname-givenNameReading > div > span",
    },
    departments:
      "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(4) > dd > ul > li",
    priorityDepartment:
      "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(5) > dd > div > span",
    birthday:
      "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(6) > dd > div > span",
    hireDate:
      "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(7) > dd > div > span",
    employeeID:
      "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(8) > dd > div > span",
    timeZone:
      "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(9) > dd > div > span",
    language:
      "#js-settings-content > div.b-settings-profile-general > div > div.b-form-form.b-form-edittoggleform.is-readonly > dl:nth-child(10) > dd > div > span",
  },
};

const nodeToString = async (node: ElementHandle<Element> | null) => {
  if (node == null) return null;
  return await node.evaluate((e) => {
    return e.textContent;
  });
};

export const getProfile = async (option: {
  url: string;
  auth: auth;
}): Promise<user<string>> => {
  const browser = await createBrowser();
  const [page] = await browser.pages();
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);
  const profileNodes: user<ElementHandle> = {
    about: await page.$(selector.about),
    basicProfile: {
      displayName: await page.$(selector.basicProfile.displayName),
      name: {
        surName: await page.$(selector.basicProfile.name.surName),
        givenName: await page.$(selector.basicProfile.name.givenName),
      },
      yomigana: {
        surNameReading: await page.$(
          selector.basicProfile.yomigana.surNameReading
        ),
        givenNameReading: await page.$(
          selector.basicProfile.yomigana.givenNameReading
        ),
      },
      departments: await Promise.all(
        (await page.$$(selector.basicProfile.departments)).map(
          async (e) => await e.$("span")
        )
      ),
      priorityDepartment: await page.$(
        selector.basicProfile.priorityDepartment
      ),
      birthday: await page.$(selector.basicProfile.birthday),
      hireDate: await page.$(selector.basicProfile.hireDate),
      employeeID: await page.$(selector.basicProfile.employeeID),
      timeZone: await page.$(selector.basicProfile.timeZone),
      language: await page.$(selector.basicProfile.language),
    },
  };
  const profileStringObject: user<string> = {
    about: await nodeToString(profileNodes.about),
    basicProfile: {
      displayName: await nodeToString(profileNodes.basicProfile.displayName),
      name: {
        surName: await nodeToString(profileNodes.basicProfile.name.surName),
        givenName: await nodeToString(profileNodes.basicProfile.name.givenName),
      },
      yomigana: {
        surNameReading: await nodeToString(
          profileNodes.basicProfile.yomigana.surNameReading
        ),
        givenNameReading: await nodeToString(
          profileNodes.basicProfile.yomigana.givenNameReading
        ),
      },
      departments: await Promise.all(
        profileNodes.basicProfile.departments.map((e) => nodeToString(e))
      ),
      priorityDepartment: await nodeToString(
        profileNodes.basicProfile.priorityDepartment
      ),
      birthday: await nodeToString(profileNodes.basicProfile.birthday),
      hireDate: await nodeToString(profileNodes.basicProfile.hireDate),
      employeeID: await nodeToString(profileNodes.basicProfile.employeeID),
      timeZone: await nodeToString(profileNodes.basicProfile.timeZone),
      language: await nodeToString(profileNodes.basicProfile.language),
    },
  };

  browser.close();

  return profileStringObject;
};
