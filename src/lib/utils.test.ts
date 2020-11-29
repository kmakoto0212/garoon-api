import { isValidateUrl } from "./utils";

test("isValidateUrl: true", () => {
  expect(isValidateUrl("https://example.syboze.com/")).toBe(true);
});
