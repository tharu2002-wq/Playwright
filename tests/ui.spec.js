const { test, expect } = require("@playwright/test");
const {
  BASE_URL,
  OUTPUT_SELECTOR,
  OUTPUT_TIMEOUT_MS,
  typeSinglishAndFlush,
} = require("./helpers/swift-translator");

test("Pos_UI_0001 - Output clears automatically when input is cleared", async ({ page }) => {
  await page.goto(BASE_URL);

  const outputBox = await typeSinglishAndFlush(page, "mama gedhara yanavaa");

  await expect(outputBox).not.toBeEmpty({ timeout: OUTPUT_TIMEOUT_MS });

  const inputField = page.getByPlaceholder("Input Your Singlish Text Here.");
  await inputField.clear();
  
  await page.waitForTimeout(1000);

  await expect(outputBox).toHaveText("");
});
