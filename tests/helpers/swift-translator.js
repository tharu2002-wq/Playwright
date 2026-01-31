const BASE_URL = "https://www.swifttranslator.com/";
const INPUT_PLACEHOLDER = "Input Your Singlish Text Here.";
const INPUT_SELECTOR = `textarea[placeholder="${INPUT_PLACEHOLDER}"]`;
const OUTPUT_LOCATOR = '.card:has-text("Sinhala") .bg-slate-50';

const OUTPUT_TIMEOUT_MS = 15000;
const LONG_INPUT_TEST_TIMEOUT_MS = 90000;

async function typeSinglishAndFlush(page, text) {
  const inputArea = page.getByPlaceholder(INPUT_PLACEHOLDER);

  await inputArea.clear();
  await page.waitForTimeout(200);

  await inputArea.fill(text.trim());
  await inputArea.blur();

  // Increased wait time for translation API
  await page.waitForTimeout(2000);
}

module.exports = {
  BASE_URL,
  INPUT_PLACEHOLDER,
  INPUT_SELECTOR,
  OUTPUT_LOCATOR,
  OUTPUT_TIMEOUT_MS,
  LONG_INPUT_TEST_TIMEOUT_MS,
  typeSinglishAndFlush,
};
