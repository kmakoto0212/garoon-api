import { createBrowser } from "./lib/Browser";
import { login } from "./garoon";
import { auth } from "./types/auth";

const selector = {
  inputTitle:
    "#body > div.mainarea > form > table > tbody > tr:nth-child(1) > td > input[type=text]",
  inputBody: "#data_editor_id",
  inputUser: "#keyword_user",
  selectUser: "#ul_selectlist_CID > li",
  addUserButton: "#btn_add_sUID",
  acknowledgment: "#\\33 _label",
  maintainer:
    "#body > div.mainarea > form > table > tbody > tr:nth-child(7) > td > label:nth-child(4)",
  submitMaintainerAll: "#btn_add_sUID_o",
  sendSubmit: "#message_button_send > a",
  draftSubmit: "#message_button_draft > a",
};

export const postMailMessage = async (option: {
  url: string;
  auth: auth;
  title: string;
  body: string;
  to: string[];
  acknowledgment?: boolean;
  MaintainerAll?: boolean;
  isDraft?: boolean;
  lazy?: number;
}): Promise<void> => {
  const browser = await createBrowser({
    headless: false,
    defaultViewport: { width: 0, height: 0 },
  });
  const [page] = await browser.pages();
  await page.goto(option.url, {
    waitUntil: "networkidle2",
  });
  await login(page, option.auth);

  await page.type(selector.inputTitle, option.title);
  await page.type(selector.inputBody, option.body);
  for (let i = 0; i < option.to.length; i++) {
    await page.evaluate(() => {
      (document.querySelector("#keyword_user") as HTMLInputElement).value = "";
    });
    const inputUser = await page.$(selector.inputUser);
    await inputUser.type(option.to[i]);
    await inputUser.press("Enter");
    await page.waitForTimeout(option.lazy || 1000);
    await page.$$(selector.selectUser).then((e) => {
      if (e.length) {
        e[0].click();
      } else {
        throw new Error(`${option.to[i]} is notfound...`);
      }
    });
    await page.click(selector.addUserButton);
  }

  if (option.acknowledgment) {
    await page.click(selector.acknowledgment);
  }
  if (option.MaintainerAll) {
    await page.click(selector.maintainer);
    await page.click(selector.submitMaintainerAll);
  }

  await page.waitForTimeout(1000);
  if (option.isDraft) {
    await page.click(selector.draftSubmit);
  } else {
    await page.click(selector.sendSubmit);
  }

  return;
};
