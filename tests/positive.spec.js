const { test, expect } = require("@playwright/test");
const {
  BASE_URL,
  OUTPUT_LOCATOR,
  OUTPUT_TIMEOUT_MS,
  LONG_INPUT_TEST_TIMEOUT_MS,
  typeSinglishAndFlush,
} = require("./helpers/swift-translator");

const POSITIVE_TEST_CASES = [
  {
    id: "Pos_Fun_0001",
    name: "Convert a short daily greeting phrase",
    size: "S",
    input: "oyaata kohomadha?",
    expected: "ඔයාට කොහොමද?",
  },
  {
    id: "Pos_Fun_0002",
    name: "Long mixed-language input with slang + typo causes incorrect conversion",
    size: "M",
    input:
      "machan mata adha meeting ekee Zoom link eka email ekak vidhihata evanna puLuvandha? Please send it before 3pm. Mama office yanna kalin check karanna oonea. Email ekak evanna amaarunam WhatsApp msg ekak dhaapan. Thx!",
    expected:
      "මචන් මට අද meeting එකේ Zoom link එක email එකක් විදිහට එවන්න පුළුවන්ද? Please send it before 3pm. මම office යන්න කලින් check කරන්න ඕනේ. Email එකක් එවන්න අමාරුනම් WhatsApp ම්ස්ග් එකක් දාපන්. ථx!",
  },
  {
    id: "Pos_Fun_0003",
    name: "Convert a short request phrase",
    size: "S",
    input: "mata help ekak karanna puLuvandha?",
    expected: "මට help එකක් කරන්න පුළුවන්ද?",
  },
  {
    id: "Pos_Fun_0004",
    name: "Convert informal greeting",
    size: "S",
    input: "kohomadha machan",
    expected: "කොහොමද මචන්",
  },
  {
    id: "Pos_Fun_0005",
    name: "Compound sentence conversion",
    size: "M",
    input: "api kaeema kanna yanavaa saha passe chithrapatayak balanavaa",
    expected: "අපි කෑම කන්න යනවා සහ පස්සෙ චිත්‍රපටයක් බලනවා",
  },
  {
    id: "Pos_Fun_0006",
    name: "Complex conditional sentence",
    size: "M",
    input: "oya enavaanam mama balan innavaa",
    expected: "ඔය එනවානම් මම බලන් ඉන්නවා",
  },
  {
    id: "Pos_Fun_0007",
    name: "Imperative command",
    size: "S",
    input: "issarahata yanna.",
    expected: "ඉස්සරහට යන්න.",
  },
  {
    id: "Pos_Fun_0008",
    name: "Negative sentence form",
    size: "S",
    input: "mama ehema karannee naehae.",
    expected: "මම එහෙම කරන්නේ නැහැ.",
  },
  {
    id: "Pos_Fun_0009",
    name: "Polite request",
    size: "M",
    input: "karuNaakaralaa mata podi udhavvak karanna puLuvandha?",
    expected: "කරුණාකරලා මට පොඩි උදව්වක් කරන්න පුළුවන්ද?",
  },
  {
    id: "Pos_Fun_0010",
    name: "Past tense sentence",
    size: "S",
    input: "mama iiyee gedhara giyaa.",
    expected: "මම ඊයේ ගෙදර ගියා.",
  },
  {
    id: "Pos_Fun_0011",
    name: "Pronoun plural usage",
    size: "S",
    input: "api yamu.",
    expected: "අපි යමු.",
  },
  {
    id: "Pos_Fun_0012",
    name: "Mixed English term – Zoom",
    size: "M",
    input: "zoom meeting ekak thiyenavaa",
    expected: "zoom meeting එකක් තියෙනවා",
  },
  {
    id: "Pos_Fun_0013",
    name: "Place name preserved",
    size: "M",
    input: "api trip eka Kandy valata yamudha.",
    expected: "අපි trip එක Kandy වලට යමුද.",
  },
  {
    id: "Pos_Fun_0014",
    name: "Time format handling",
    size: "S",
    input: "7.30 AM enna",
    expected: "7.30 AM එන්න",
  },
  {
    id: "Pos_Fun_0015",
    name: "Currency format",
    size: "S",
    input: "Rs. 5000 dhenna",
    expected: "Rs. 5000 දෙන්න",
  },
  {
    id: "Pos_Fun_0016",
    name: "Question with English word",
    size: "S",
    input: "email eka yavannadha?",
    expected: "email එක යවන්නද?",
  },
  {
    id: "Pos_Fun_0017",
    name: "Short confirmation response",
    size: "S",
    input: "ov, eeka hari",
    expected: "ඔව්, ඒක හරි",
  },
  {
    id: "Pos_Fun_0018",
    name: "Informal phrasing",
    size: "S",
    input: "eeyi, ooka dhiyan.",
    expected: "ඒයි, ඕක දියන්.",
  },
  {
    id: "Pos_Fun_0019",
    name: "Slang expression with punctuation",
    size: "S",
    input: "ela machan! supiri!!",
    expected: "එල මචන්! සුපිරි!!",
  },
  {
    id: "Pos_Fun_0020",
    name: "Simple greeting phrase",
    size: "S",
    input: "aayuboovan",
    expected: "ආයුබෝවන්",
  },
  {
    id: "Pos_Fun_0021",
    name: "Date format handling",
    size: "S",
    input: "25/12/2025",
    expected: "25/12/2025",
  },
  {
    id: "Pos_Fun_0022",
    name: "Common daily expression",
    size: "S",
    input: "mata nidhimathayi.",
    expected: "මට නිදිමතයි.",
  },
  {
    id: "Pos_Fun_0023",
    name: "Repeated word expression for emphasis",
    size: "S",
    input: "chuttak chuttak",
    expected: "චුට්ටක් චුට්ටක්",
  },
  {
    id: "Pos_Fun_0024",
    name: "Technical term",
    size: "S",
    input: "WiFi eka  sakkriya  karanna",
    expected: "WiFi එක  සක්ක්‍රිය  කරන්න",
  },
];

for (const tc of POSITIVE_TEST_CASES) {
  test(`${tc.id} - ${tc.name}`, async ({ page }) => {
    if (tc.size === "M") {
      test.setTimeout(LONG_INPUT_TEST_TIMEOUT_MS);
    }
    await page.goto(BASE_URL);
    await typeSinglishAndFlush(page, tc.input);

    if (tc.size === "M") {
      await page.waitForTimeout(1500);
    }

    const outputBox = page.locator(OUTPUT_LOCATOR);
    await expect(outputBox).toContainText(tc.expected.trim(), {
      timeout: OUTPUT_TIMEOUT_MS,
    });

    const output = await outputBox.textContent();
    expect(output).toContain(tc.expected.trim());
  });
}
