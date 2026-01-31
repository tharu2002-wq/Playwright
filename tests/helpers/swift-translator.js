 const { expect } = require("@playwright/test");

const BASE_URL = "https://www.swifttranslator.com/";
const INPUT_PLACEHOLDER = "Input Your Singlish Text Here.";
const OUTPUT_TIMEOUT_MS = 45000;
const LONG_INPUT_TEST_TIMEOUT_MS = 90000;

const OUTPUT_SELECTOR = '.card:has(.panel-title:text("Sinhala")) .bg-slate-50';

async function typeSinglishAndFlush(page, text) {
  const inputArea = page.getByPlaceholder(INPUT_PLACEHOLDER);
  
  await inputArea.clear();
  await page.waitForTimeout(500);
  
  await inputArea.fill(text.trim());
  
  await inputArea.press('Space');
  await page.waitForTimeout(100);
  await inputArea.press('Backspace');
  await page.waitForTimeout(300);
  
  await inputArea.blur();
  await page.waitForTimeout(1000);
  
  const outputBox = page.locator(OUTPUT_SELECTOR);
  
  let hasTranslation = false;
  let attempts = 0;
  const maxAttempts = 60; // 30 seconds
  
  while (attempts < maxAttempts && !hasTranslation) {
    try {
      const content = await outputBox.textContent({ timeout: 1000 });
      if (content && content.trim().length > 0) {
        if (/[\u0D80-\u0DFF]/.test(content)) {
          hasTranslation = true;
          break;
        }
        if (attempts > 4) {
          hasTranslation = true;
          break;
        }
      }
    } catch (e) {
    }
    
    await page.waitForTimeout(500);
    attempts++;
  }
  
  if (!hasTranslation) {
    await page.screenshot({ path: 'translation-failed.png', fullPage: true });
    
    const debugText = await outputBox.textContent().catch(() => 'ERROR GETTING TEXT');
    const inputText = await inputArea.inputValue();
    console.log(`Translation failed after ${maxAttempts * 0.5}s`);
    console.log(`Input: "${inputText}"`);
    console.log(`Output: "${debugText}"`);
    
    throw new Error(`Translation did not appear within ${maxAttempts * 0.5} seconds`);
  }
  
  await page.waitForTimeout(1000);
  const finalText = await outputBox.textContent();
  console.log(`Translation successful after ${attempts * 0.5}s output: "${finalText}"`);
  
  return outputBox;
}

module.exports = {
  BASE_URL,
  INPUT_PLACEHOLDER,
  OUTPUT_SELECTOR,
  OUTPUT_TIMEOUT_MS,
  LONG_INPUT_TEST_TIMEOUT_MS,
  typeSinglishAndFlush,
};
