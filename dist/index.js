const loginSelector = {
  dialog: "#login-dialog",
  inputUserName: "#username-\\:0-text",
  inputPassword: "#password-\\:1-text",
  submit: ".login-button",
};
const errorSelector = {
  dialog: "body > div.error_content_grn",
};
export const isError = async (page) => {
  return !!(await page.$(errorSelector.dialog));
};
export const isLogin = async (page) => {
  return !(await page.$(loginSelector.dialog));
};
export const login = async (page, auth) => {
  if (await isLogin(page)) return;
  await page.type(loginSelector.inputUserName, auth.username);
  await page.type(loginSelector.inputPassword, auth.password);
  await page.click(loginSelector.submit);
  await page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
};
