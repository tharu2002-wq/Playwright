const { test, expect } = require("@playwright/test");
const {
  BASE_URL,
  OUTPUT_SELECTOR,
  OUTPUT_TIMEOUT_MS,
  LONG_INPUT_TEST_TIMEOUT_MS,
  typeSinglishAndFlush,
} = require("./helpers/swift-translator");

const NEGATIVE_TEST_CASES = [
  {
    id: "Neg_Fun_0001",
    name: "Incorrect tense conversion",
    size: "S",
    input: "mama ayer office giyaha",
    correctExpected: "මම ඊයේ කාර්යාලයට ගියා",
  },
  {
    id: "Neg_Fun_0002",
    name: "Negation not handled correctly",
    size: "S",
    input: "mama ehema karanna naha",
    correctExpected: "මම එහෙම කරන්නෙ නැහැ",
  },
  {
    id: "Neg_Fun_0003",
    name: "Question form incorrectly converted",
    size: "S",
    input: "oyata kohomada",
    correctExpected: "ඔබට කොහොමද?",
  },
  {
    id: "Neg_Fun_0004",
    name: "Politeness level not preserved",
    size: "M",
    input: "please podi help ekak denna puluwanda",
    correctExpected: "කරුණාකර පොඩි උදව්වක් කරන්න පුළුවන්ද?",
  },
  {
    id: "Neg_Fun_0005",
    name: "Incorrect handling of mixed language",
    size: "M",
    input: "mama meeting eka cancel karala email ekak yawanna",
    correctExpected: "මම meeting එක cancel කරලා email එකක් යවන්න",
  },
  {
    id: "Neg_Fun_0006",
    name: "Joined vs segmented words misinterpreted",
    size: "S",
    input: "apihemuwothbalamu",
    correctExpected: "අපි හමුවුවොත් බලමු",
  },
  {
    id: "Neg_Fun_0007",
    name: "Repeated word emphasis lost",
    size: "S",
    input: "hari hari lassanai",
    correctExpected: "හරි හරි ලස්සනයි",
  },
  {
    id: "Neg_Fun_0008",
    name: "Compound sentence partially translated",
    size: "M",
    input: "mama enna hithuwa namuth vaessa unaa",
    correctExpected: "මම එන්න හිතුවා නමුත් වැස්ස උනා",
  },
  {
    id: "Neg_Fun_0009",
    name: "Multi-clause / newline handling",
    size: "S",
    input: "mama gedhara innee oyaa enavadha",
    correctExpected: "මම ගෙදර ඉන්නේ\nඔයා එනවද",
  },
  {
    id: "Neg_Fun_0010",
    name: "Pronoun perspective changed",
    size: "S",
    input: "api passe kathaa karamu",
    correctExpected: "අපි පස්සේ කතා කරමු",
  },
];

for (const tc of NEGATIVE_TEST_CASES) {
  test(`${tc.id} - ${tc.name}`, async ({ page }) => {
    if (tc.size === "M") {
      test.setTimeout(LONG_INPUT_TEST_TIMEOUT_MS);
    }

    await page.goto(BASE_URL);
    
    const outputBox = await typeSinglishAndFlush(page, tc.input);

    const output = (await outputBox.textContent())?.trim();

    expect(output).not.toBe(tc.correctExpected.trim());
  });
}


