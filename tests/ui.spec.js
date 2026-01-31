
const { test, expect } = require("@playwright/test");
const {
  BASE_URL,
  OUTPUT_LOCATOR,
  OUTPUT_TIMEOUT_MS,
  typeSinglishAndFlush,
} = require("./helpers/swift-translator");

test("Pos_UI_0001 - Output clears automatically when input is cleared", async ({ page }) => {
  await page.goto(BASE_URL);

  
  await typeSinglishAndFlush(page, "mama gedhara yanavaa");

  const outputBox = page.locator(OUTPUT_LOCATOR);

  await expect(outputBox).not.toBeEmpty({ timeout: OUTPUT_TIMEOUT_MS });

  const inputField = page.getByPlaceholder("Input Your Singlish Text Here.");
  await inputField.fill("");

  await expect(outputBox).toHaveText("");
});
