import { createBrowser } from "./lib/Browser";
import { login } from "./garoon";
import { auth } from "./types/auth";

export const postMailMessage = async (option: {
  url: string;
  auth: auth;
  title: string;
  body: string;
  to: string[];
  acknowledgment?: boolean;
  MaintainerAll?: boolean;
  isDraft?: boolean;
}): Promise<void> => {
  const browser = await createBrowser({
    headless: false,
    defaultViewport: { width: 0, height: 0 },
  });
  const page = await browser.newPage();
  const selector = {
    inputTitle:
      "#body > div.mainarea > form > table > tbody > tr:nth-child(1) > td > input[type=text]",
    inputBody: "#data_editor_id",
    inputUser: "#keyword_user",
    selectUser: ".selectlist_text_grn",
    addUserButton: "#btn_add_sUID",
    acknowledgment: "#\\33 _label",
    maintainer:
      "#body > div.mainarea > form > table > tbody > tr:nth-child(7) > td > label:nth-child(4)",
    submitMaintainerAll: "#btn_add_sUID_o",
    sendSubmit: "#message_button_send > a",
    draftSubmit: "#message_button_draft > a",
  };
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
    await page.waitForSelector(selector.selectUser);
    await page.$(selector.selectUser).then((e) => e.focus());
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.click(selector.addUserButton);
  }

  if (option.acknowledgment) {
    await page.click(selector.acknowledgment);
  }
  if (option.MaintainerAll) {
    await page.click(selector.maintainer);
    await page.click(selector.submitMaintainerAll);
  }
  if (option.isDraft) {
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.click(selector.draftSubmit);
  } else {
    await page.click(selector.sendSubmit);
  }

  return;
};
